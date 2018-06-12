import { logger } from './logger';
import * as express from 'express';
import * as ECT from 'ect';
import { instantiateContentfulClient, ContentfulClient } from './contentfulClient';
import { debug } from 'util';

logger.info('Hello! contentful-microsite-demo figuring itself out here... 👍🏾');

const ectRenderer = ECT({ root : __dirname + '/views', ext : '.ect' });

const expressApp = express();
expressApp.set('views', './views');
expressApp.set('view engine', 'ect');
expressApp.engine('ect', ectRenderer.render);

const contentfulClient = instantiateContentfulClient();

contentfulClient.getMicrositeConfig()
    .then(setupAllRequests)
    .then(setupRoutes)
    .then(startApp);

function setupAllRequests(micrositeConfig: any) {
    expressApp.use((request: any, response: any, next: any) => {
        response.locals.layout = micrositeConfig.fields.layout;

        next();
    });

    return micrositeConfig;
}

function setupRoutes(micrositeConfig: any) {
    for(let page of micrositeConfig.fields.pages) {
        expressApp.get(page.fields.uri.toLowerCase(), handleWithConfig(page));

        logger.info(`page ${page.fields.name} configured with uri: ${page.fields.uri}`);
    }

    return micrositeConfig;
}

function handleWithConfig(pageConfig: any) {
    return (request: any, response: any) => {
        response.locals.pageConfig = pageConfig;
        response.render('index', response.locals);
    }
}

function startApp(micrositeConfig: any) {

    expressApp.listen(process.env.PORT, () => {
        logger.info('contentful-microsite-demo listening on port %d! THAT MEANS WE ARE SO LIVE', process.env.PORT);
    });

    return;
}
