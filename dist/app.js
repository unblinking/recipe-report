"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const logger_1 = __importDefault(require("./services/logger"));
class App {
    constructor(port, middlewares, controllers) {
        this.app = express_1.default();
        this.logger = new logger_1.default();
        this.port = port;
        this.middlewares(middlewares);
        this.controllers(controllers);
    }
    middlewares(middlewares) {
        this.app.use(middlewares);
    }
    controllers(controllers) {
        controllers.forEach((controller) => {
            this.app.use('/', controller.router);
        });
    }
    listenWrapper() {
        const promise = new Promise((resolve) => {
            this.app.listen(this.port, () => {
                this.logger.write(`Expressjs is listening on port ${this.port}`);
                resolve();
            });
        });
        return promise;
    }
}
exports.default = App;
//# sourceMappingURL=app.js.map