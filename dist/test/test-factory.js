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
exports.TestFactory = void 0;
const user_model_1 = require("../db/models/user-model");
const userId = `9aa98e23-24ec-4403-8517-ca27968cfe25`;
class TestFactory {
    userNew() {
        return __awaiter(this, void 0, void 0, function* () {
            const props = {
                id: userId,
                username: `noreplyuser`,
                password: `$2a$08$PPhEIhC/lPgUMRAXpvrYL.ehrApeV7pdsGU6/DSufUFvuhiFtqR4C`,
                email_address: `noreply@recipe.report`,
                date_created: new Date(),
            };
            const user = new user_model_1.UserModel(props);
            return user;
        });
    }
    userActivated() {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userNew();
            user.setDateActivated(new Date());
            return user;
        });
    }
}
exports.TestFactory = TestFactory;
//# sourceMappingURL=test-factory.js.map