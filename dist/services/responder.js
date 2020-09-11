"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Responder {
    success(res, data) {
        res.status(200).json({
            status: 'success',
            data: data,
        });
    }
    fail(res, data) {
        res.status(200).json({
            status: 'fail',
            data: data,
        });
    }
    error(res, message, code, data) {
        res.status(200).json({
            status: 'error',
            message: message,
            code: code,
            data: data,
        });
    }
}
exports.default = Responder;
//# sourceMappingURL=responder.js.map