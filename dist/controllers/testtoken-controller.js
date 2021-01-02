"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestTokenController = void 0;
const express_1 = require("express");
const responder_service_1 = require("../services/responder-service");
const tokenwall_1 = require("../middlewares/tokenwall");
const laststop_1 = require("../middlewares/laststop");
class TestTokenController {
    constructor() {
        this.router = express_1.Router();
        this.path = `/testtoken`;
        this.initRoutes = () => {
            this.router.get(`/`, tokenwall_1.tokenwall, this.success);
            this.router.use(laststop_1.fiveHundred);
        };
        this.success = (_req, res, next) => {
            try {
                const respond = new responder_service_1.Responder();
                respond.success(res, {
                    message: `Welcome to the team, DZ-something-something.`,
                });
            }
            catch (err) {
                next(err);
            }
        };
        this.initRoutes();
    }
}
exports.TestTokenController = TestTokenController;
//# sourceMappingURL=testtoken-controller.js.map