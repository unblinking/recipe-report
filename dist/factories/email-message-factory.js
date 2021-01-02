"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailMessageFactory = void 0;
const email_message_model_1 = require("../db/models/email-message-model");
const email_templates_1 = require("./email-templates");
const domainconverter_1 = require("../db/models/domainconverter");
class EmailMessageFactory {
    constructor() {
        this.activation = (user, token) => {
            const bodyActivation = email_templates_1.bodyActivationTemplate(user, token);
            const emailDto = {
                from: email_templates_1.noReplyAddress,
                to: user.email_address,
                subject: email_templates_1.subjectActivation,
                body: bodyActivation,
            };
            const email = domainconverter_1.DomainConverter.fromDto(email_message_model_1.EmailMessageModel, emailDto);
            return email;
        };
    }
}
exports.EmailMessageFactory = EmailMessageFactory;
//# sourceMappingURL=email-message-factory.js.map