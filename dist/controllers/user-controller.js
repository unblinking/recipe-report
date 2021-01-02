"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const express_1 = require("express");
const responder_service_1 = require("../services/responder-service");
const laststop_1 = require("../middlewares/laststop");
const service_requests_1 = require("../db/models/service-requests");
const user_service_1 = require("../services/user-service");
class UserController {
    constructor() {
        this.router = express_1.Router();
        this.path = `/user`;
        this.initRoutes = () => {
            this.router.post(`/register`, this.register);
            this.router.get(`/activate:token`, this.notimplemented);
            this.router.post(`/login`, this.notimplemented);
            this.router.use(laststop_1.fiveHundred);
        };
        this.notimplemented = (_req, res, next) => {
            try {
                const respond = new responder_service_1.Responder(501);
                respond.error(res, `501 Not Implemented`, `501`);
            }
            catch (err) {
                next(err);
            }
        };
        this.register = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const serviceRequest = new service_requests_1.UserRegistrationRequest(req.body.username, req.body.email_address, req.body.password);
                const userService = new user_service_1.UserService();
                const serviceResponse = yield userService.register(serviceRequest);
                const respond = new responder_service_1.Responder();
                if (serviceResponse.success === true) {
                    respond.success(res);
                }
                else {
                    respond.error(res, `Error registering user`, `500`);
                }
            }
            catch (err) {
                next(err);
            }
        });
        this.initRoutes();
    }
}
exports.UserController = UserController;
//# sourceMappingURL=user-controller.js.map