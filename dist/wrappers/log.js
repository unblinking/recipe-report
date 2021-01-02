"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const bs_logger_1 = require("bs-logger");
exports.logger = bs_logger_1.createLogger({
    targets: process.env.MY_LOG_TARGETS,
});
//# sourceMappingURL=log.js.map