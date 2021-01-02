"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.callHistory = void 0;
const log_1 = require("../wrappers/log");
const callHistory = (req, _res, next) => {
    log_1.logger.info(`Request: ${req.method} ${req.path}`);
    next();
};
exports.callHistory = callHistory;
//# sourceMappingURL=callhistory.js.map