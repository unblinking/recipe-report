"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const responder_1 = __importDefault(require("../services/responder"));
class TestToken {
    constructor() {
        this.router = express_1.default.Router();
        this.path = '/testtoken';
        this.initRoutes = () => {
            this.router.get(this.path, this.success);
        };
        this.success = (_req, res) => {
            const respond = new responder_1.default();
            respond.success(res, {
                message: `Welcome to the team, DZ-something-something.`,
            });
        };
        this.initRoutes();
    }
}
exports.default = TestToken;
//# sourceMappingURL=testtoken.js.map