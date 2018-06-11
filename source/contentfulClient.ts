import { createClient } from "contentful";
import { logger } from './logger';
import * as Promise from "bluebird";
require('isomorphic-fetch');

interface ContentfulConfig {
    space: string;
    accessToken: string;
}

const contentfulConfig: ContentfulConfig = {
    space: process.env.CONTENTFUL_API_SPACE_ID,
    accessToken: process.env.CONTENTFUL_API_ACCESS_TOKEN
}

const micrositeEntryId = process.env.CONTENTFUL_MICROSITE_ENTRY_ID;

class ContentfulClient {
    client: any;

    constructor(contentfulConfig: ContentfulConfig) {
        this.client = createClient(contentfulConfig);
    }

    public getMicrositeConfig() {
        return this.client.getEntries({ "sys.id": micrositeEntryId, include: 3 })
            .then(getHTMLForEachPage);
    }
}

function getHTMLForEachPage(entries: any) {
    const micrositeConfig = entries.items[0];
    let requestFileContents: Promise<any>[] = [];

    for(let asset of entries.includes.Asset) {
        if(asset.fields.file.contentType === 'text/plain') {
            requestFileContents.push(requestFileContent(asset));
        }
    }

    return Promise.all(requestFileContents)
        .then((assetsWithContent) => {
            let assetsWithContentById: any = {};

            for(let asset of assetsWithContent) {
                assetsWithContentById[asset.sys.id] = asset;
            }

            for(let page of micrositeConfig.fields.pages) {
                if(page.fields.html !== undefined) {
                    page.fields.html = assetsWithContentById[page.fields.html.sys.id]
                }
            }

            return micrositeConfig;
        });

}

function requestFileContent(asset: any): Promise<any> {
    let requestPromise: Promise<any> = undefined;

    let assetUrl = "https:" + asset.fields.file.url;
    logger.debug(`Requesting ${ assetUrl } `);
    return Promise.resolve(fetch(assetUrl))
        .then((response: any) => {
            return response.text()
                .then((responseText: any) => {
                    asset.fields.content = responseText;
                    return asset;
                });
            }
        );
}

function instantiateContentfulClient(): ContentfulClient {
    const contentfulClient: ContentfulClient = new ContentfulClient(contentfulConfig);

    return contentfulClient;
}



export { instantiateContentfulClient, ContentfulClient }