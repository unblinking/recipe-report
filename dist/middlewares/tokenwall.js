"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenWall = void 0;
const log_1 = __importDefault(require("../services/log"));
const responder_1 = require("../services/responder");
const token_1 = require("../services/token");
const cryptography_1 = require("../services/cryptography");
class TokenWall {
    constructor() {
        this.log = new log_1.default();
        this.token = new token_1.Token();
        this.cryptography = new cryptography_1.Cryptography();
        this.responder = new responder_1.Responder();
        this.filter = (req, _res, next) => {
            try {
                const token = req.headers.token;
                if (!token)
                    throw new Error(`Tokenwall error. Token is required.`);
                const payload = this.token.decodeToken(token);
                if (payload.type !== `access`)
                    throw new Error(`Tokenwall error. Token type is not access.`);
                const userId = this.cryptography.decrypt(payload.id);
                req['userId'] = userId;
                next();
            }
            catch (error) {
                this.responder.error(_res, error.message, error.name, error);
            }
        };
    }
}
exports.TokenWall = TokenWall;
//# sourceMappingURL=tokenwall.js.map