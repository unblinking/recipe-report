"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Responder = void 0;
const log_1 = require("./log");
class Responder {
    constructor(statusCode) {
        this.success = (res, data) => {
            log_1.logger.info(`Responder|Success|${this.statusCode}`);
            res.status(this.statusCode).json({
                status: 'success',
                data: data,
            });
        };
        this.fail = (res, data) => {
            log_1.logger.warn(`Responder|Fail|${this.statusCode}`);
            res.status(this.statusCode).json({
                status: 'fail',
                data: data,
            });
        };
        this.error = (res, message, code, data) => {
            log_1.logger.error(`Responder|Error|${this.statusCode}|${message}`);
            res.status(this.statusCode).json({
                status: 'error',
                message: message,
                code: code,
                data: data,
            });
        };
        this.statusCode = statusCode !== null && statusCode !== void 0 ? statusCode : 200;
    }
}
exports.Responder = Responder;
//# sourceMappingURL=responder.js.map