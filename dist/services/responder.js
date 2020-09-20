"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Responder {
    constructor(statusCode) {
        this.success = (res, data) => {
            res.status(this.statusCode).json({
                status: 'success',
                data: data,
            });
        };
        this.fail = (res, data) => {
            res.status(this.statusCode).json({
                status: 'fail',
                data: data,
            });
        };
        this.error = (res, message, code, data) => {
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
exports.default = Responder;
//# sourceMappingURL=responder.js.map