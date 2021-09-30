"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeToken = exports.encodeToken = exports.tokenType = void 0;
const jwt_simple_1 = __importDefault(require("jwt-simple"));
const cryptography_1 = require("./cryptography");
var tokenType;
(function (tokenType) {
    tokenType[tokenType["NONE"] = 0] = "NONE";
    tokenType[tokenType["ACTIVATION"] = 1] = "ACTIVATION";
    tokenType[tokenType["ACCESS"] = 2] = "ACCESS";
})(tokenType = exports.tokenType || (exports.tokenType = {}));
const encodeToken = (userId, type, ttl = new Date().getTime() + 60 * 60 * 24 * 1000) => {
    const secret = process.env.JWT_SECRET;
    if (!secret)
        throw new Error(`JWT error. Secret key is not defined.`);
    if (!userId)
        throw new Error(`JWT error. User ID is not defined.`);
    if (!type)
        throw new Error(`JWT error. Type is not defined.`);
    const payload = {
        id: userId,
        type: type,
        iat: new Date().getTime(),
        ttl: ttl,
    };
    const stringified = JSON.stringify(payload);
    const encryptedPayload = (0, cryptography_1.encrypt)(stringified);
    const encodedToken = jwt_simple_1.default.encode(encryptedPayload, secret, 'HS512');
    return encodedToken;
};
exports.encodeToken = encodeToken;
const decodeToken = (token) => {
    const secret = process.env.JWT_SECRET;
    if (!secret)
        throw new Error(`JWT error. Secret key is not defined.`);
    if (!token)
        throw new Error(`JWT error. Token is not defined.`);
    const decodedToken = jwt_simple_1.default.decode(token, secret, false, 'HS512');
    const decryptedPayload = (0, cryptography_1.decrypt)(decodedToken);
    const parsed = JSON.parse(decryptedPayload);
    return parsed;
};
exports.decodeToken = decodeToken;
//# sourceMappingURL=token.js.map