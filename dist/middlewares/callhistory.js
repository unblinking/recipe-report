"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CallHistory = void 0;
const log_1 = __importDefault(require("../services/log"));
class CallHistory {
    constructor() {
        this.logger = new log_1.default();
        this.log = (req, _res, next) => {
            const callDetails = `Request: ${req.method} ${req.path}`;
            this.logger.write(callDetails);
            next();
        };
    }
}
exports.CallHistory = CallHistory;
//# sourceMappingURL=callhistory.js.map