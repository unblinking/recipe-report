"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("./logger"));
class Fun {
    constructor() {
        var _a;
        this.logger = new logger_1.default();
        this.version = (_a = process.env.npm_package_version) !== null && _a !== void 0 ? _a : 'unknown';
        this.graffiti = `\x1b[1m\x1b[32m
     ____           _
    |  _ \\ ___  ___(_)_ __   ___
    | |_) / _ \\/ __| | '_ \\ / _ \\
    |  _ <  __/ (__| | |_) |  __/
    |_|_\\_\\___|\\___|_| .__/ \\___|
    |  _ \\ ___ _ __  |_|_  _ __| |_
    | |_) / _ \\ '_ \\ / _ \\| '__| __|
    |  _ <  __/ |_) | (_) | |  | |_
    |_| \\_\\___| .__/ \\___/|_|   \\__|
    \x1b[37mAlpha     \x1b[1m\x1b[32m|_|      \x1b[37mversion ${this.version}
    \x1b[0m`;
        this.tag = () => {
            const promise = new Promise((resolve) => {
                this.logger.write(this.graffiti);
                resolve();
            });
            return promise;
        };
    }
}
exports.default = Fun;
//# sourceMappingURL=fun.js.map