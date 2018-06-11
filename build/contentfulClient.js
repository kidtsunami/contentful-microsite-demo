"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const contentful_1 = require("contentful");
const logger_1 = require("./logger");
const Promise = require("bluebird");
require('isomorphic-fetch');
const contentfulConfig = {
    space: process.env.CONTENTFUL_API_SPACE_ID,
    accessToken: process.env.CONTENTFUL_API_ACCESS_TOKEN
};
const micrositeEntryId = process.env.CONTENTFUL_MICROSITE_ENTRY_ID;
class ContentfulClient {
    constructor(contentfulConfig) {
        this.client = contentful_1.createClient(contentfulConfig);
    }
    getMicrositeConfig() {
        return this.client.getEntries({ "sys.id": micrositeEntryId, include: 3 })
            .then(getHTMLForEachPage);
    }
}
exports.ContentfulClient = ContentfulClient;
function getHTMLForEachPage(entries) {
    const micrositeConfig = entries.items[0];
    let requestFileContents = [];
    for (let asset of entries.includes.Asset) {
        if (asset.fields.file.contentType === 'text/plain') {
            requestFileContents.push(requestFileContent(asset));
        }
    }
    return Promise.all(requestFileContents)
        .then((assetsWithContent) => {
        let assetsWithContentById = {};
        for (let asset of assetsWithContent) {
            assetsWithContentById[asset.sys.id] = asset;
        }
        for (let page of micrositeConfig.fields.pages) {
            if (page.fields.html !== undefined) {
                page.fields.html = assetsWithContentById[page.fields.html.sys.id];
            }
        }
        return micrositeConfig;
    });
}
function requestFileContent(asset) {
    let requestPromise = undefined;
    let assetUrl = "https:" + asset.fields.file.url;
    logger_1.logger.debug(`Requesting ${assetUrl} `);
    return Promise.resolve(fetch(assetUrl))
        .then((response) => {
        return response.text()
            .then((responseText) => {
            asset.fields.content = responseText;
            return asset;
        });
    });
}
function instantiateContentfulClient() {
    const contentfulClient = new ContentfulClient(contentfulConfig);
    return contentfulClient;
}
exports.instantiateContentfulClient = instantiateContentfulClient;
//# sourceMappingURL=contentfulClient.js.map