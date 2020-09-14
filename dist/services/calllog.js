"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("./logger"));
class CallLog {
    constructor() {
        this.logger = new logger_1.default();
    }
    record(req, _res, next) {
        this.logger.write(`Request: ${req.method} ${req.path}`);
        next();
    }
}
exports.default = CallLog;
//# sourceMappingURL=calllog.js.map