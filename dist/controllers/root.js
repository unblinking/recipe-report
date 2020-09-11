"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const responder_1 = __importDefault(require("../services/responder"));
class Root {
    constructor() {
        this.router = express_1.default.Router();
        this.path = '/';
        this.curtsy = (req, res) => {
            const respond = new responder_1.default();
            respond.success(res, {
                message: 'Welcome to the Recipe.Report API server.',
                headers: req.headers,
            });
        };
        this.initRoutes();
    }
    initRoutes() {
        this.router.get(this.path, this.curtsy);
    }
}
exports.default = Root;
//# sourceMappingURL=root.js.map