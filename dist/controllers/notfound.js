"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const logger_1 = __importDefault(require("../services/logger"));
const responder_1 = __importDefault(require("../services/responder"));
class NotFound {
    constructor() {
        this.logger = new logger_1.default();
        this.router = express_1.default.Router();
        this.path = '*';
        this.initRoutes = () => {
            this.router.get(this.path, this.notfound);
        };
        this.notfound = (req, res) => {
            this.logger.write(`Request for a route that doesn't exist. ${req.method} ${req.path}`);
            const respond = new responder_1.default(404);
            respond.fail(res, {
                message: `404 Not Found. The requested resource could not be found but may be available in the future. Subsequent requests by the client are permissible.`,
            });
        };
        this.initRoutes();
    }
}
exports.default = NotFound;
//# sourceMappingURL=notfound.js.map