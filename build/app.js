"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("./logger");
const express = require("express");
const ECT = require("ect");
logger_1.logger.info("Hello! contentful-microsite-demo figuring itself out here... 👍🏾");
const ectRenderer = ECT({ root: __dirname + '/views', ext: '.ect' });
const expressApp = express();
expressApp.set("views", "./views");
expressApp.set("view engine", "ect");
expressApp.engine('ect', ectRenderer.render);
expressApp.get("/", (request, response) => {
    response.render("index");
});
expressApp.listen(process.env.PORT, function () {
    logger_1.logger.info("contentful-microsite-demo listening on port %d! THAT MEANS WE ARE SO LIVE", process.env.PORT);
});
//# sourceMappingURL=app.js.map