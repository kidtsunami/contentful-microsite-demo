"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("./logger");
const express = require("express");
const ECT = require("ect");
const contentfulClient_1 = require("./contentfulClient");
logger_1.logger.info('Hello! contentful-microsite-demo figuring itself out here... 👍🏾');
const ectRenderer = ECT({ root: __dirname + '/views', ext: '.ect' });
const expressApp = express();
expressApp.set('views', './views');
expressApp.set('view engine', 'ect');
expressApp.engine('ect', ectRenderer.render);
const contentfulClient = contentfulClient_1.instantiateContentfulClient();
contentfulClient.getMicrositeConfig()
    .then(setupRoutes)
    .then(startApp);
function setupRoutes(micrositeConfig) {
    for (let page of micrositeConfig.fields.pages) {
        expressApp.get(page.fields.uri.toLowerCase(), handleWithConfig(page));
        logger_1.logger.info(`page ${page.fields.name} configured with uri: ${page.fields.uri}`);
    }
}
function handleWithConfig(pageConfig) {
    return (request, response) => {
        response.locals.pageConfig = pageConfig;
        response.render('index', response.locals);
    };
}
function startApp(micrositeConfig) {
    expressApp.listen(process.env.PORT, () => {
        logger_1.logger.info('contentful-microsite-demo listening on port %d! THAT MEANS WE ARE SO LIVE', process.env.PORT);
    });
    return;
}
//# sourceMappingURL=app.js.map