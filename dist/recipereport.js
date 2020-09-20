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
const testtoken_1 = __importDefault(require("./controllers/testtoken"));
const notfound_1 = __importDefault(require("./controllers/notfound"));
const logger_1 = __importDefault(require("./services/logger"));
const fun_1 = __importDefault(require("./services/fun"));
class RecipeReport {
    constructor() {
        var _a;
        this.logger = new logger_1.default();
        this.callHistory = new callhistory_1.default();
        this.fun = new fun_1.default();
        this.port = parseInt((_a = process.env.PORT) !== null && _a !== void 0 ? _a : '', 10);
        this.middlewares = [
            helmet_1.default(),
            BodyParser.json(),
            BodyParser.urlencoded({ extended: true }),
            this.callHistory.log,
        ];
        this.controllers = [
            new root_1.default(),
            new testtoken_1.default(),
            new notfound_1.default(),
        ];
        this.app = new app_1.default(this.port, this.middlewares, this.controllers);
        this.start = () => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.app.listenWrapper();
                yield this.fun.tag();
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