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
exports.UserFactory = void 0;
const user_model_1 = require("../db/models/user-model");
const index_1 = require("../db/index");
class UserFactory {
    create(props) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!props.password)
                throw new Error(`Password is not defined.`);
            const postgreSQL = new index_1.PostgreSQL();
            const queryResult = yield postgreSQL.hashAndSalt(props.password);
            if (queryResult.rowCount < 1 || !queryResult.rows[0].crypt)
                throw new Error(`Error hashing password.`);
            const hashedAndSaltedPassword = queryResult.rows[0].crypt;
            props.password = hashedAndSaltedPassword;
            props.date_created = new Date();
            const user = new user_model_1.UserModel(props);
            return user;
        });
    }
}
exports.UserFactory = UserFactory;
//# sourceMappingURL=user-factory.js.map