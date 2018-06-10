"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston = require("winston");
const logger = new winston.Logger({
    level: "debug",
    transports: [
        new (winston.transports.Console)()
    ]
});
exports.logger = logger;
//# sourceMappingURL=logger.js.map