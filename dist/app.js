"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const logger_1 = __importDefault(require("./services/logger"));
class App {
    constructor(port, middlewares, controllers, fourOhFour, fiveHundred) {
        this.logger = new logger_1.default();
        this.port = 0;
        this.expressApplication = express_1.default().set('json spaces', 2);
        this.middlewares = (middlewares) => {
            this.expressApplication.use(middlewares);
        };
        this.controllers = (controllers) => {
            controllers.forEach((controller) => {
                this.expressApplication.use('/', controller.router);
            });
        };
        this.fourOhFour = (fourOhFour) => {
            this.expressApplication.use(fourOhFour);
        };
        this.fiveHundred = (fiveHundred) => {
            this.expressApplication.use(fiveHundred);
        };
        this.listenWrapper = () => {
            const promise = new Promise((resolve) => {
                this.expressApplication.listen(this.port, () => {
                    this.logger.write(`Expressjs is listening on port ${this.port}`);
                    resolve();
                });
            });
            return promise;
        };
        this.port = port;
        this.middlewares(middlewares);
        this.controllers(controllers);
        this.fourOhFour(fourOhFour);
        this.fiveHundred(fiveHundred);
    }
}
exports.default = App;
//# sourceMappingURL=app.js.map