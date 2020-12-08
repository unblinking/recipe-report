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
const responder_1 = require("../services/responder");
class RootController {
    constructor() {
        this.router = express_1.Router();
        this.path = `/`;
        this.initRoutes = () => {
            this.router.get(`${this.path}`, this.curtsy);
        };
        this.curtsy = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const respond = new responder_1.Responder();
            respond.success(res, {
                message: 'Welcome to the Recipe.Report API server.',
                headers: req.headers,
            });
        });
        this.initRoutes();
    }
}
exports.RootController = RootController;
//# sourceMappingURL=rootcontroller.js.map