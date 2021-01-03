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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostgreSQL = void 0;
const pg_1 = require("pg");
const log_1 = require("../wrappers/log");
class PostgreSQL {
    constructor() {
        this.pool = new pg_1.Pool({
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: process.env.DB_DATABASE,
            password: process.env.DB_PASSWORD,
            port: parseInt(process.env.DB_PORT, 10),
        });
        this.query = (text, params) => __awaiter(this, void 0, void 0, function* () {
            const start = Date.now();
            const result = yield this.pool.query(text, params);
            const duration = Date.now() - start;
            log_1.logger.info(`Executed query. ${text}, ${duration}, ${result.rowCount}`);
            return result;
        });
        this.getClient = () => __awaiter(this, void 0, void 0, function* () {
            const client = yield this.pool.connect();
            const release = client.release;
            const timeout = setTimeout(() => {
                log_1.logger.warn(`A pg client has been out for more than 5 seconds!`);
            }, 5000);
            client.release = () => {
                clearTimeout(timeout);
                client.release = release;
                return release.apply(client);
            };
            return client;
        });
        this.hashAndSalt = (text) => __awaiter(this, void 0, void 0, function* () {
            const query = `SELECT crypt('${text}', gen_salt('bf', 8))`;
            const result = yield this.pool.query(query, []);
            return result;
        });
        this.authenticate = (email, text) => __awaiter(this, void 0, void 0, function* () {
            const query = `SELECT id FROM users WHERE email = '${email}' AND password = crypt('${text}', password)`;
            const result = yield this.pool.query(query, []);
            return result;
        });
    }
}
exports.PostgreSQL = PostgreSQL;
//# sourceMappingURL=index.js.map