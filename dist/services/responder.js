"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Responder = void 0;
const log_1 = __importDefault(require("./log"));
class Responder {
    constructor(statusCode) {
        this.logger = new log_1.default();
        this.success = (res, data) => {
            this.logger.write(`Responder|Success|${this.statusCode}`);
            res.status(this.statusCode).json({
                status: 'success',
                data: data,
            });
        };
        this.fail = (res, data) => {
            this.logger.write(`Responder|Fail|${this.statusCode}`);
            res.status(this.statusCode).json({
                status: 'fail',
                data: data,
            });
        };
        this.error = (res, message, code, data) => {
            this.logger.write(`Responder|Error|${this.statusCode}|${message}`);
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