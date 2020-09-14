"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../services/logger"));
class CallHistory {
    constructor() {
        this.logger = new logger_1.default();
    }
    log(req, _res, next) {
        const callDetails = `Request: ${req.method} ${req.path}`;
        this.logger.write(callDetails);
        next();
    }
}
exports.default = CallHistory;
//# sourceMappingURL=callhistory.js.map