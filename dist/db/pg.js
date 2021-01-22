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
const pg_1 = require("pg");
const logger_1 = __importDefault(require("../services/logger"));
class PostgreSQL {
    constructor() {
        var _a, _b, _c, _d, _e;
        this.logger = new logger_1.default();
        this.pool = new pg_1.Pool({
            user: (_a = process.env.DB_USER) !== null && _a !== void 0 ? _a : ``,
            host: (_b = process.env.DB_HOST) !== null && _b !== void 0 ? _b : ``,
            database: (_c = process.env.DB_DATABASE) !== null && _c !== void 0 ? _c : ``,
            password: (_d = process.env.DB_PASSWORD) !== null && _d !== void 0 ? _d : ``,
            port: parseInt((_e = process.env.DB_PORT) !== null && _e !== void 0 ? _e : ``, 10),
        });
        this.query = (text, params) => __awaiter(this, void 0, void 0, function* () {
            try {
                const start = Date.now();
                const result = yield this.pool.query(text, params);
                const duration = Date.now() - start;
                this.logger.write(`Executed query. ${text}, ${duration}, ${result.rowCount}`);
                return result;
            }
            catch (error) {
                this.logger.write(error);
                return error;
            }
        });
        this.getClient = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const client = yield this.pool.connect();
                const release = client.release;
                const timeout = setTimeout(() => {
                    console.error('A pg client has been out for more than 5 seconds!');
                }, 5000);
                client.release = () => {
                    clearTimeout(timeout);
                    client.release = release;
                    return release.apply(client);
                };
                return client;
            }
            catch (error) {
                this.logger.write(error);
                return error;
            }
        });
        this.hashAndSalt = (text) => __awaiter(this, void 0, void 0, function* () {
            const query = `SELECT crypt('${text}', gen_salt('bf', 8))`;
            const result = yield this.query(query, []);
            return result;
        });
        this.authenticate = (email, text) => __awaiter(this, void 0, void 0, function* () {
            const query = `SELECT _id FROM users WHERE _email = '${email}' AND _password = crypt('${text}', _password)`;
            const result = yield this.query(query, []);
            return result;
        });
    }
}
exports.default = PostgreSQL;
//# sourceMappingURL=pg.js.map