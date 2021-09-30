"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailMessageService = void 0;
const email_message_factory_1 = require("../factories/email-message-factory");
const send_email_1 = require("../wrappers/send-email");
const bs_logger_1 = require("bs-logger");
class EmailMessageService {
    sendActivation(user, token) {
        return new Promise((resolve, reject) => {
            const emailMessageFactory = new email_message_factory_1.EmailMessageFactory();
            const email = emailMessageFactory.activation(user, token);
            (0, send_email_1.sendmail)({
                from: email.from,
                to: email.to,
                subject: email.subject,
                text: email.body,
            }, (err, reply) => {
                if (err) {
                    bs_logger_1.logger.error(`Sendmail error: Error name: ${err.name}. Error message: ${err.message}`, err.stack);
                    reject(err);
                }
                else {
                    bs_logger_1.logger.info(`Sendmail success. Sent activation email message to user ${user.id} ${user.email_address}. Reply: ${reply}`);
                    resolve(reply);
                }
            });
        });
    }
}
exports.EmailMessageService = EmailMessageService;
//# sourceMappingURL=email-message-service.js.map