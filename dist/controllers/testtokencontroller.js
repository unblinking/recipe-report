"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestTokenController = void 0;
const express_1 = require("express");
const tokenwall_1 = require("../middlewares/tokenwall");
const responder_1 = require("../services/responder");
class TestTokenController {
    constructor() {
        this.router = express_1.Router();
        this.path = `/testtoken`;
        this.tokenwall = new tokenwall_1.TokenWall();
        this.initRoutes = () => {
            this.router.get(`${this.path}`, this.tokenwall.filter, this.success);
        };
        this.success = (_req, res) => {
            const respond = new responder_1.Responder();
            respond.success(res, {
                message: `Welcome to the team, DZ-something-something.`,
            });
        };
        this.initRoutes();
    }
}
exports.TestTokenController = TestTokenController;
//# sourceMappingURL=testtokencontroller.js.map