"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("./logger"));
class CallLogger {
    constructor() {
        this.logger = new logger_1.default();
    }
    write(req, _res, next) {
        const callDetails = `Request: ${req.method} ${req.path}`;
        console.log(callDetails);
        console.log(this);
        this.logger.write(callDetails);
        next();
    }
}
exports.default = CallLogger;
//# sourceMappingURL=calllogger.js.map