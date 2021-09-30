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
const bs_logger_1 = require("bs-logger");
class UserController {
    constructor() {
        this.router = (0, express_1.Router)();
        this.path = `/user`;
        this.initRoutes = () => {
            this.router.post(`/register`, this.register);
            this.router.get(`/activate/:token`, this.activate);
            this.router.post(`/login`, this.authenticate);
            this.router.use(laststop_1.fiveHundred);
        };
        this.register = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const serviceRequest = new service_requests_1.UserRegistrationRequest(Object.assign({}, req.body));
                const userService = new user_service_1.UserService();
                const serviceResponse = yield userService.register(serviceRequest);
                const respond = new responder_service_1.Responder();
                if (serviceResponse.success === true) {
                    respond.success(res);
                }
                else {
                    const serviceErrorMessage = (_a = serviceResponse.error) === null || _a === void 0 ? void 0 : _a.message;
                    bs_logger_1.logger.error(serviceErrorMessage);
                    respond.error(res, `Error registering user: ${serviceErrorMessage}`, `500`);
                }
            }
            catch (err) {
                next(err);
            }
        });
        this.activate = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _b;
            try {
                const serviceRequest = new service_requests_1.UserActivationRequest(Object.assign({}, req.params));
                const userService = new user_service_1.UserService();
                const serviceResponse = yield userService.activate(serviceRequest);
                const respond = new responder_service_1.Responder();
                if (serviceResponse.success === true) {
                    respond.success(res);
                }
                else {
                    const serviceErrorMessage = (_b = serviceResponse.error) === null || _b === void 0 ? void 0 : _b.message;
                    bs_logger_1.logger.error(serviceErrorMessage);
                    respond.error(res, `Error activating user: ${serviceErrorMessage}`, `500`);
                }
            }
            catch (err) {
                next(err);
            }
        });
        this.authenticate = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _c, _d;
            try {
                const serviceRequest = new service_requests_1.UserAuthenticationRequest(Object.assign({}, req.body));
                const userService = new user_service_1.UserService();
                const serviceResponse = yield userService.authenticate(serviceRequest);
                const respond = new responder_service_1.Responder();
                if (serviceResponse.success === true) {
                    respond.success(res, { token: (_c = serviceResponse.item) === null || _c === void 0 ? void 0 : _c.token });
                }
                else {
                    const serviceErrorMessage = (_d = serviceResponse.error) === null || _d === void 0 ? void 0 : _d.message;
                    bs_logger_1.logger.error(serviceErrorMessage);
                    respond.error(res, `Error authenticating user: ${serviceErrorMessage}`, `500`);
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