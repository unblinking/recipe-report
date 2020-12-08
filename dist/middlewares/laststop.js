"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const log_1 = __importDefault(require("../services/log"));
const responder_1 = require("../services/responder");
class LastStop {
    constructor() {
        this.logger = new log_1.default();
        this.fourOhFour = (req, res, next) => {
            this.logger.write(`404 Not Found. ${req.method} ${req.path}`);
            const respond = new responder_1.Responder(404);
            respond.error(res, `404 Not Found.`, `404`);
            next();
        };
        this.fiveHundred = (err, req, res, next) => {
            this.logger.write(`500 Internal Server Error. ${req.method} ${req.path}`);
            const respond = new responder_1.Responder(500);
            respond.error(res, `500 Internal Server Error`, `500`, {
                error: err.name,
                message: err.message,
            });
            next();
        };
    }
}
exports.default = LastStop;
//# sourceMappingURL=laststop.js.map