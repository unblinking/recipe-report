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
exports.RootController = void 0;
const express_1 = require("express");
const responder_service_1 = require("../services/responder-service");
const laststop_1 = require("../middlewares/laststop");
class RootController {
    constructor() {
        this.router = express_1.Router();
        this.path = `/`;
        this.initRoutes = () => {
            this.router.get(`/`, this.curtsy);
            this.router.use(laststop_1.fiveHundred);
        };
        this.curtsy = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const respond = new responder_service_1.Responder();
                respond.success(res, {
                    message: 'Welcome to the Recipe.Report API server.',
                    request_headers: req.headers,
                });
            }
            catch (err) {
                next(err);
            }
        });
        this.initRoutes();
    }
}
exports.RootController = RootController;
//# sourceMappingURL=root-controller.js.map