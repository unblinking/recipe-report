"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const express_1 = require("express");
const responder_1 = require("../services/responder");
const laststop_1 = require("../middlewares/laststop");
class UserController {
    constructor() {
        this.router = express_1.Router();
        this.path = `/user`;
        this.initRoutes = () => {
            this.router.get(`/`, this.notimplemented);
            this.router.use(laststop_1.fiveHundred);
        };
        this.notimplemented = (_req, res, next) => {
            try {
                const respond = new responder_1.Responder(501);
                respond.error(res, `501 Not Implemented`, `501`);
            }
            catch (err) {
                next(err);
            }
        };
        this.initRoutes();
    }
}
exports.UserController = UserController;
//# sourceMappingURL=usercontroller.js.map