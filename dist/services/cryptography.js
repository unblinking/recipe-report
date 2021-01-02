"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decrypt = exports.encrypt = void 0;
const crypto_1 = __importDefault(require("crypto"));
const key = process.env.CRYPTO_KEY;
const ivLength = parseInt(process.env.CRYPTO_IV_LENGTH, 10);
const algorithm = process.env.CRYPTO_ALGO;
const varCheck = () => {
    if (!key)
        throw new Error(`Crypto error. Crypto key is not defined.`);
    if (!ivLength)
        throw new Error(`Crypto error. IV length is not defined.`);
    if (!algorithm)
        throw new Error(`Crypto error. Algorithm is not defined.`);
};
exports.encrypt = (plainText) => {
    varCheck();
    const iv = crypto_1.default.randomBytes(ivLength);
    const cipher = crypto_1.default.createCipheriv(algorithm, Buffer.from(key), iv);
    let encrypted = cipher.update(plainText);
    encrypted = Buffer.concat([encrypted, cipher.final(), iv]);
    const encryptedEncodedText = encrypted.toString('base64');
    return encryptedEncodedText;
};
exports.decrypt = (encryptedEncodedText) => {
    varCheck();
    const encrypted = Buffer.from(encryptedEncodedText, 'base64');
    const encryptedLength = encrypted.length - ivLength;
    const iv = encrypted.slice(encryptedLength);
    const encryptedText = encrypted.slice(0, encryptedLength);
    const decipher = crypto_1.default.createDecipheriv(algorithm, Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    const plainText = decrypted.toString();
    return plainText;
};
//# sourceMappingURL=cryptography.js.map