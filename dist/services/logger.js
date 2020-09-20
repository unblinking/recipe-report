"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Logger {
    constructor() {
        this.write = (string) => {
            const timestamp = new Date().toISOString();
            console.log(`${timestamp} | ${string}`);
        };
    }
}
exports.default = Logger;
//# sourceMappingURL=logger.js.map