"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cryptography = void 0;
const crypto_1 = __importDefault(require("crypto"));
class Cryptography {
    constructor() {
        this.key = process.env.CRYPTO_KEY;
        this.ivLength = parseInt(process.env.CRYPTO_IV_LENGTH, 10);
        this.algorithm = process.env.CRYPTO_ALGO;
        this.encrypt = (plainText) => {
            const iv = crypto_1.default.randomBytes(this.ivLength);
            const cipher = crypto_1.default.createCipheriv(this.algorithm, Buffer.from(this.key), iv);
            let encrypted = cipher.update(plainText);
            encrypted = Buffer.concat([encrypted, cipher.final(), iv]);
            const encryptedEncodedText = encrypted.toString('base64');
            return encryptedEncodedText;
        };
        this.decrypt = (encryptedEncodedText) => {
            const encrypted = Buffer.from(encryptedEncodedText, 'base64');
            const encryptedLength = encrypted.length - this.ivLength;
            const iv = encrypted.slice(encryptedLength);
            const encryptedText = encrypted.slice(0, encryptedLength);
            const decipher = crypto_1.default.createDecipheriv(this.algorithm, Buffer.from(this.key), iv);
            let decrypted = decipher.update(encryptedText);
            decrypted = Buffer.concat([decrypted, decipher.final()]);
            const plainText = decrypted.toString();
            return plainText;
        };
        if (!this.key)
            throw new Error(`Crypto error. Crypto key is not defined.`);
        if (!this.ivLength)
            throw new Error(`Crypto error. IV length is not defined.`);
        if (!this.algorithm)
            throw new Error(`Crypto error. Algorithm is not defined.`);
    }
}
exports.Cryptography = Cryptography;
//# sourceMappingURL=cryptography.js.map