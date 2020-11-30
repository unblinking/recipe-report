"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const maildev_1 = __importDefault(require("maildev"));
const logger_1 = __importDefault(require("./services/logger"));
const recipereport_1 = __importDefault(require("./recipereport"));
class DevEmailServer {
    constructor() {
        this.logger = new logger_1.default();
        this.setup = () => {
            const smtpPort = 1139;
            const outHost = 'localhost';
            const outPort = 25;
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
                    this.logger.write(`MailDev received new email: ${newEmail.subject}`);
                });
                maildev.listen();
                this.logger.write(`MailDev outgoing SMTP Server ${outHost}:${outPort} (user:undefined, pass:undefined, secure:no)`);
                this.logger.write(`MailDev webapp running at http://0.0.0.0:1080`);
                this.logger.write(`MailDev SMTP Server running at 0.0.0.0:${smtpPort}`);
            }
            catch (ex) {
                this.logger.write(ex);
                process.exit(1);
            }
        };
    }
}
if (require.main === module) {
    const devEmailServer = new DevEmailServer();
    devEmailServer.setup();
    const recipeReport = new recipereport_1.default();
    recipeReport.start();
}
//# sourceMappingURL=develop.js.map