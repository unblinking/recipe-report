"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const BodyParser = __importStar(require("body-parser"));
const helmet_1 = __importDefault(require("helmet"));
const heroku_ssl_redirect_1 = __importDefault(require("heroku-ssl-redirect"));
const app_1 = __importDefault(require("./app"));
const callhistory_1 = __importDefault(require("./middlewares/callhistory"));
const fun_1 = __importDefault(require("./services/fun"));
const laststop_1 = __importDefault(require("./middlewares/laststop"));
const logger_1 = __importDefault(require("./services/logger"));
const root_1 = __importDefault(require("./controllers/root"));
const testtoken_1 = __importDefault(require("./controllers/testtoken"));
const user_1 = __importDefault(require("./db/models/user"));
const pg_1 = __importDefault(require("./db/pg"));
const user_2 = __importDefault(require("./repositories/user"));
class RecipeReport {
    constructor() {
        var _a;
        this.logger = new logger_1.default();
        this.callHistory = new callhistory_1.default();
        this.lastStop = new laststop_1.default();
        this.port = parseInt((_a = process.env.EXPRESS_PORT) !== null && _a !== void 0 ? _a : ``, 10);
        this.middlewares = [
            helmet_1.default({
                contentSecurityPolicy: { directives: { defaultSrc: ["'self'"] } },
                referrerPolicy: { policy: 'same-origin' },
            }),
            heroku_ssl_redirect_1.default(),
            BodyParser.json(),
            BodyParser.urlencoded({ extended: true }),
            this.callHistory.log,
        ];
        this.controllers = [new root_1.default(), new testtoken_1.default()];
        this.fourOhFour = this.lastStop.fourOhFour;
        this.fiveHundred = this.lastStop.fiveHundred;
        this.app = new app_1.default(this.port, this.middlewares, this.controllers, this.fourOhFour, this.fiveHundred);
        this.fun = new fun_1.default();
        this.environmentVariablesExist = () => __awaiter(this, void 0, void 0, function* () {
            const promise = new Promise((resolve, reject) => {
                let missing = ``;
                if (process.env.EXPRESS_PORT === undefined) {
                    missing = missing.concat(`\n EXPRESS_PORT`);
                }
                if (process.env.CRYPTO_KEY === undefined) {
                    missing = missing.concat(`\n CRYPTO_KEY`);
                }
                if (process.env.CRYPTO_ALGO === undefined) {
                    missing = missing.concat(`\n CRYPTO_ALGO`);
                }
                if (process.env.CRYPTO_IV_LENGTH === undefined) {
                    missing = missing.concat(`\n CRYPTO_IV_LENGTH`);
                }
                if (process.env.JWT_SECRET === undefined) {
                    missing = missing.concat(`\n JWT_SECRET`);
                }
                if (process.env.JWT_ALGORITHM === undefined) {
                    missing = missing.concat(`\n JWT_ALGORITHM`);
                }
                if (process.env.DB_USER === undefined) {
                    missing = missing.concat(`\n DB_USER`);
                }
                if (process.env.DB_HOST === undefined) {
                    missing = missing.concat(`\n DB_HOST`);
                }
                if (process.env.DB_DATABASE === undefined) {
                    missing = missing.concat(`\n DB_DATABASE`);
                }
                if (process.env.DB_PASSWORD === undefined) {
                    missing = missing.concat(`\n DB_PASSWORD`);
                }
                if (process.env.DB_PORT === undefined) {
                    missing = missing.concat(`\n DB_PORT`);
                }
                if (missing === ``) {
                    resolve();
                }
                else {
                    const error = new Error(`Environment variable(s) missing:${missing}`);
                    error.name = `EnvironmentVariableError`;
                    reject(error);
                }
            });
            return promise;
        });
        this.start = () => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.environmentVariablesExist();
                yield this.app.listenWrapper();
                yield this.fun.tag();
                const user = new user_1.default(undefined, `Joshua2`, `password`, `joshua2@unblinking.io`, new Date(), new Date(), new Date());
                const postgreSQL = new pg_1.default();
                const db = yield postgreSQL.getClient();
                const userRepo = new user_2.default(db, `users`);
                const result = yield userRepo.createOne(user);
                console.log(result);
            }
            catch (error) {
                this.logger.write(error);
                process.exit(1);
            }
        });
    }
}
if (require.main === module) {
    try {
        const recipeReport = new RecipeReport();
        recipeReport.start();
    }
    catch (error) {
        console.log(error);
        process.exit(1);
    }
}
exports.default = RecipeReport;
//# sourceMappingURL=recipereport.js.map