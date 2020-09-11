"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Logger {
    writer(req, _res, next) {
        console.log('Request logged:', req.method, req.path);
        next();
    }
    eraser(_req, _res, next) {
        next();
    }
}
exports.default = Logger;
//# sourceMappingURL=logger.js.map