"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendmail = void 0;
exports.sendmail = require('sendmail')({
    silent: true,
    devPort: process.env.SENDMAIL_DEV_PORT,
    devHost: process.env.SENDMAIL_DEV_HOST,
});
//# sourceMappingURL=send-email.js.map