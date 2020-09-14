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
const app_1 = __importDefault(require("./app"));
const callhistory_1 = __importDefault(require("./middlewares/callhistory"));
const root_1 = __importDefault(require("./controllers/root"));
const test_1 = __importDefault(require("./controllers/test"));
const logger_1 = __importDefault(require("./services/logger"));
class RecipeReport {
    constructor() {
        var _a, _b;
        this.port = parseInt((_a = process.env.PORT) !== null && _a !== void 0 ? _a : '', 10);
        this.version = (_b = process.env.npm_package_version) !== null && _b !== void 0 ? _b : '';
        this.graffiti = `\x1b[1m\x1b[32m
     ____           _
    |  _ \\ ___  ___(_)_ __   ___
    | |_) / _ \\/ __| | '_ \\ / _ \\
    |  _ <  __/ (__| | |_) |  __/
    |_|_\\_\\___|\\___|_| .__/ \\___|
    |  _ \\ ___ _ __  |_|_  _ __| |_
    | |_) / _ \\ '_ \\ / _ \\| '__| __|
    |  _ <  __/ |_) | (_) | |  | |_
    |_| \\_\\___| .__/ \\___/|_|   \\__|
    \x1b[37mAlpha     \x1b[1m\x1b[32m|_|      \x1b[37mversion ${this.version}
    \x1b[0m`;
        this.callHistory = new callhistory_1.default();
        this.logger = new logger_1.default();
        this.middlewares = [
            helmet_1.default(),
            BodyParser.json(),
            BodyParser.urlencoded({ extended: true }),
            this.callHistory.log.bind(this.callHistory),
        ];
        this.controllers = [new root_1.default(), new test_1.default()];
        this.app = new app_1.default(this.port, this.middlewares, this.controllers);
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.app.listen();
                this.logger.write(this.graffiti);
            }
            catch (ex) {
                this.logger.write(ex);
                process.exit(1);
            }
        });
    }
}
if (require.main === module) {
    const recipeReport = new RecipeReport();
    recipeReport.start();
}
exports.default = RecipeReport;
//# sourceMappingURL=recipereport.js.map