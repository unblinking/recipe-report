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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BodyParser = __importStar(require("body-parser"));
const helmet_1 = __importDefault(require("helmet"));
const app_1 = __importDefault(require("./app"));
const logger_1 = __importDefault(require("./services/logger"));
const root_1 = __importDefault(require("./controllers/root"));
const test_1 = __importDefault(require("./controllers/test"));
const PackageJson = require('../package.json');
class RecipeReport {
    constructor() {
        this.port = 1138;
        this.diary = new logger_1.default();
        this.middleWares = [
            helmet_1.default(),
            BodyParser.json(),
            BodyParser.urlencoded({ extended: true }),
            this.diary.writer,
        ];
        this.controllers = [new root_1.default(), new test_1.default()];
        this.app = new app_1.default(this.port, this.middleWares, this.controllers);
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
    \x1b[37mAlpha     \x1b[1m\x1b[32m|_|      \x1b[37mversion ${PackageJson.version}
    \x1b[0m`;
    }
    start() {
        this.app.listen();
        console.log(this.graffiti);
    }
}
if (require.main === module) {
    const recipeReport = new RecipeReport();
    recipeReport.start();
}
//# sourceMappingURL=server.js.map