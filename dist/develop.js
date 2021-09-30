"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const maildev_1 = __importDefault(require("maildev"));
const log_1 = require("./wrappers/log");
const recipereport_1 = require("./recipereport");
const smtpPort = 1139;
const outHost = 'localhost';
const outPort = 25;
const mailDevSetup = log_1.logger.wrap(function mailDevSetup() {
    try {
        const maildev = new maildev_1.default({
            smtp: smtpPort,
            outgoingHost: outHost,
            outgoingPort: outPort,
            silent: true,
            disableWeb: false,
        });
        maildev.on('new', (email) => {
            const newEmail = email;
            process.env.TEST_EMAIL_SENT_TEXT = newEmail.text;
            process.env.TEST_EMAIL_SENT_SUBJECT = newEmail.subject;
            process.env.TEST_EMAIL_SENT_FROM = newEmail.from[0].address;
            process.env.TEST_EMAIL_SENT_TO = newEmail.to[0].address;
            log_1.logger.info(`MailDev received new email: ${newEmail.subject}`);
        });
        maildev.listen();
        log_1.logger.info(`MailDev outgoing SMTP Server ${outHost}:${outPort} (user:undefined, pass:undefined, secure:no)`);
        log_1.logger.info(`MailDev webapp running at http://0.0.0.0:1080`);
        log_1.logger.info(`MailDev SMTP Server running at 0.0.0.0:${smtpPort}`);
    }
    catch (e) {
        log_1.logger.fatal(e.message);
        process.exit(1);
    }
});
if (require.main === module) {
    mailDevSetup();
    (0, recipereport_1.start)();
}
//# sourceMappingURL=develop.js.map