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
exports.start = void 0;
const BodyParser = __importStar(require("body-parser"));
const helmet_1 = __importDefault(require("helmet"));
const heroku_ssl_redirect_1 = __importDefault(require("heroku-ssl-redirect"));
const log_1 = require("./wrappers/log");
const fun_factory_1 = require("./factories/fun-factory");
const envvarcheck_1 = require("./envvarcheck");
const app_1 = require("./wrappers/app");
const callhistory_1 = require("./middlewares/callhistory");
const root_controller_1 = require("./controllers/root-controller");
const testtoken_controller_1 = require("./controllers/testtoken-controller");
const user_controller_1 = require("./controllers/user-controller");
const port = parseInt(process.env.PORT, 10);
const middlewares = [
    (0, helmet_1.default)({
        contentSecurityPolicy: { directives: { defaultSrc: ["'self'"] } },
        referrerPolicy: { policy: 'same-origin' },
    }),
    (0, heroku_ssl_redirect_1.default)(),
    BodyParser.json(),
    BodyParser.urlencoded({ extended: true }),
    callhistory_1.callHistory,
];
const controllers = [
    new root_controller_1.RootController(),
    new testtoken_controller_1.TestTokenController(),
    new user_controller_1.UserController(),
];
exports.start = log_1.logger.wrap(function start() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            (0, fun_factory_1.graffiti)();
            (0, envvarcheck_1.envVarCheck)();
            (0, app_1.listen)(middlewares, controllers, port);
        }
        catch (e) {
            log_1.logger.fatal(e.message);
            process.exit(1);
        }
    });
});
if (require.main === module) {
    (0, exports.start)();
}
//# sourceMappingURL=recipereport.js.map