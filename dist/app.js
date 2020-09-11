"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
class App {
    constructor(port, middleWares, controllers) {
        this.app = express_1.default();
        this.port = port;
        this.middlewares(middleWares);
        this.controllers(controllers);
    }
    middlewares(middleWares) {
        middleWares.forEach((middleWare) => {
            this.app.use(middleWare);
        });
    }
    controllers(controllers) {
        controllers.forEach((controller) => {
            this.app.use('/', controller.router);
        });
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log(`Application is listening on port ${this.port}`);
        });
    }
}
exports.default = App;
//# sourceMappingURL=app.js.map