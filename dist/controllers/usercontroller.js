"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const express_1 = require("express");
const responder_1 = require("../services/responder");
class UserController {
    constructor() {
        this.router = express_1.Router();
        this.path = `/user`;
        this.initRoutes = () => {
            this.router.get(`${this.path}`, this.notimplemented);
        };
        this.notimplemented = (_req, res) => {
            const respond = new responder_1.Responder(501);
            respond.error(res, `This endpoint hasn't been implemented yet.`, `501`);
        };
        this.initRoutes();
    }
}
exports.UserController = UserController;
//# sourceMappingURL=usercontroller.js.map