"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listen = void 0;
const express_1 = __importDefault(require("express"));
const log_1 = require("./log");
const laststop_1 = require("../middlewares/laststop");
exports.listen = log_1.logger.wrap(function listen(middlewares, controllers, port) {
    const app = express_1.default().set('json spaces', 2);
    app.use(middlewares);
    controllers.forEach((controller) => {
        app.use(controller.path, controller.router);
    });
    app.use(laststop_1.fourOhFour);
    app.use(laststop_1.fiveHundred);
    app.listen(port, () => {
        log_1.logger.info(`Expressjs is listening on port ${port}`);
    });
});
//# sourceMappingURL=app.js.map