"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPassword = void 0;
const core_1 = require("@zxcvbn-ts/core");
const language_common_1 = __importDefault(require("@zxcvbn-ts/language-common"));
const language_en_1 = __importDefault(require("@zxcvbn-ts/language-en"));
const checkPassword = (password, email, username) => {
    const options = {
        translations: language_en_1.default.translations,
        graphs: language_common_1.default.adjacencyGraphs,
        dictionary: Object.assign(Object.assign(Object.assign({}, language_common_1.default.dictionary), language_en_1.default.dictionary), { userInputs: [email, username] }),
    };
    core_1.ZxcvbnOptions.setOptions(options);
    const result = (0, core_1.zxcvbn)(password);
    const score = result.score;
    const warnings = result.feedback.warning ? 1 : 0;
    const suggestions = result.feedback.suggestions.length;
    const passwordResult = {
        success: true,
    };
    if (score < 3 || warnings || suggestions) {
        passwordResult.success = false;
        passwordResult.message = `Password is weak.`;
        if (warnings) {
            passwordResult.message += ` ${result.feedback.warning}`;
        }
        if (suggestions) {
            passwordResult.message += ` ${result.feedback.suggestions.join(' ')}`;
        }
    }
    return passwordResult;
};
exports.checkPassword = checkPassword;
//# sourceMappingURL=password-check.js.map