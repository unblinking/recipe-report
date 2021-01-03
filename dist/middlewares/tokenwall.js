"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenwall = void 0;
const log_1 = require("../wrappers/log");
const token_1 = require("../wrappers/token");
const cryptography_1 = require("../wrappers/cryptography");
const responder_service_1 = require("../services/responder-service");
const tokenwall = (req, _res, next) => {
    try {
        const token = req.headers.token;
        if (!token)
            throw new Error(`Token is required in req.headers.token.`);
        const payload = token_1.decodeToken(token);
        if (payload.type !== token_1.tokenType.ACCESS)
            throw new Error(`Token type is not access. Try again using a valid access token.`);
        const userId = cryptography_1.decrypt(payload.id);
        req['userId'] = userId;
        next();
    }
    catch (error) {
        log_1.logger.error(`Tokenwall error. ${error.message}`);
        const data = {
            errorName: `401 Unauthorized`,
            errorMessage: error.message,
        };
        const responder = new responder_service_1.Responder(401);
        responder.fail(_res, data);
    }
};
exports.tokenwall = tokenwall;
//# sourceMappingURL=tokenwall.js.map