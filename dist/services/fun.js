"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.graffiti = void 0;
const log_1 = require("./log");
const version = process.env.npm_package_version;
const piece = `\x1b[1m\x1b[32m
  ____           _
 |  _ \\ ___  ___(_)_ __   ___
 | |_) / _ \\/ __| | '_ \\ / _ \\
 |  _ <  __/ (__| | |_) |  __/
 |_|_\\_\\___|\\___|_| .__/ \\___|
 |  _ \\ ___ _ __  |_|_  _ __| |_
 | |_) / _ \\ '_ \\ / _ \\| '__| __|
 |  _ <  __/ |_) | (_) | |  | |_
 |_| \\_\\___| .__/ \\___/|_|   \\__|
 \x1b[37mAlpha     \x1b[1m\x1b[32m|_|      \x1b[37mversion ${version}
 \x1b[0m`;
exports.graffiti = log_1.logger.wrap(function graffiti() {
    log_1.logger.info(piece);
});
//# sourceMappingURL=fun.js.map