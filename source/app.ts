import { logger } from "./logger";
import * as express from "express";
import * as ECT from "ect";

logger.info("Hello! contentful-microsite-demo figuring itself out here... 👍🏾");

const ectRenderer = ECT({ root : __dirname + '/views', ext : '.ect' });

const expressApp = express();
expressApp.set("views", "./views");
expressApp.set("view engine", "ect");
expressApp.engine('ect', ectRenderer.render);

expressApp.get("/", (request: express.Request, response: express.Response) => {
    response.render("index");
});

expressApp.listen(process.env.PORT, () => {
    logger.info("contentful-microsite-demo listening on port %d! THAT MEANS WE ARE SO LIVE", process.env.PORT);
});