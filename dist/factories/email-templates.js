"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bodyActivationTemplate = exports.subjectActivation = exports.noReplyAddress = void 0;
const getProtocol = () => {
    let protocol = `http`;
    if (process.env.NODE_ENV === 'production') {
        protocol = `https`;
    }
    return protocol;
};
const getHostname = () => {
    let hostname = `localhost:1138`;
    if (process.env.NODE_ENV === 'production') {
        hostname = `api.recipe.report`;
    }
    return hostname;
};
exports.noReplyAddress = `no-reply@recipe.report`;
exports.subjectActivation = `Recipe.Report new user account activation required.`;
const bodyActivationTemplate = (user, token) => {
    return `
Hello ${user.email_address},

Thank you for registering with Recipe.Report recently. You may login after completing activation. Please follow this link to activate your new account:

${getProtocol()}://${getHostname()}/user/activate/${token}

You received this email because you (or someone else) used this email address to create a new account.

Thank you,

http://www.Recipe.Report

`;
};
exports.bodyActivationTemplate = bodyActivationTemplate;
//# sourceMappingURL=email-templates.js.map