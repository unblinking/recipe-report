"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fiveHundred = exports.fourOhFour = void 0;
const log_1 = require("../wrappers/log");
const responder_service_1 = require("../services/responder-service");
exports.fourOhFour = log_1.logger.wrap(function fourOhFour(req, _res, _next) {
    const err = new Error(`Not Found`);
    log_1.logger.info(`404 Not Found. ${req.method} ${req.path}`);
    const respond = new responder_service_1.Responder(404);
    respond.fail(_res, err.message);
});
const fiveHundred = (err, _req, res, next) => {
    log_1.logger.info(`500 Internal Server Error.`);
    if (res.headersSent) {
        return next(err);
    }
    const respond = new responder_service_1.Responder(500);
    respond.error(res, `500 Internal Server Error`, `500`, {
        error: err.name,
        message: err.message,
    });
};
exports.fiveHundred = fiveHundred;
//# sourceMappingURL=laststop.js.map