"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const logger_1 = __importDefault(require("./logger"));
class Encrypter {
    constructor() {
        var _a, _b, _c;
        this.logger = new logger_1.default();
        this.key = (_a = process.env.CRYPTO_KEY) !== null && _a !== void 0 ? _a : ``;
        this.ivLength = parseInt((_b = process.env.CRYPTO_IV_LENGTH) !== null && _b !== void 0 ? _b : ``, 10);
        this.algorithm = (_c = process.env.CRYPTO_ALGO) !== null && _c !== void 0 ? _c : ``;
        this.encrypt = (plainText) => __awaiter(this, void 0, void 0, function* () {
            const promise = new Promise((resolve, reject) => {
                try {
                    const iv = crypto_1.default.randomBytes(this.ivLength);
                    const cipher = crypto_1.default.createCipheriv(this.algorithm, Buffer.from(this.key), iv);
                    let encrypted = cipher.update(plainText);
                    encrypted = Buffer.concat([encrypted, cipher.final(), iv]);
                    const encryptedEncodedText = encrypted.toString('base64');
                    resolve(encryptedEncodedText);
                }
                catch (error) {
                    this.logger.write(error);
                    reject(error);
                }
            });
            return promise;
        });
        this.decrypt = (encryptedEncodedText) => __awaiter(this, void 0, void 0, function* () {
            const promise = new Promise((resolve, reject) => {
                try {
                    const encrypted = Buffer.from(encryptedEncodedText, 'base64');
                    const encryptedLength = encrypted.length - this.ivLength;
                    const iv = encrypted.slice(encryptedLength);
                    const encryptedText = encrypted.slice(0, encryptedLength);
                    const decipher = crypto_1.default.createDecipheriv(this.algorithm, Buffer.from(this.key), iv);
                    let decrypted = decipher.update(encryptedText);
                    decrypted = Buffer.concat([decrypted, decipher.final()]);
                    const plainText = decrypted.toString();
                    resolve(plainText);
                }
                catch (error) {
                    this.logger.write(error);
                    reject(error);
                }
            });
            return promise;
        });
    }
}
exports.default = Encrypter;
//# sourceMappingURL=encrypter.js.map