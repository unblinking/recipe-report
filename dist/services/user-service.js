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
exports.UserService = void 0;
const service_responses_1 = require("../db/models/service-responses");
const user_model_1 = require("../db/models/user-model");
const user_factory_1 = require("../factories/user-factory");
const user_repo_1 = require("../repositories/user-repo");
const index_1 = require("../db/index");
const domainconverter_1 = require("../db/models/domainconverter");
const token_1 = require("../wrappers/token");
const email_message_service_1 = require("./email-message-service");
const authentication_model_1 = require("../db/models/authentication-model");
class UserService {
    register(req) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const res = new service_responses_1.UserRegistrationResponse();
            const db = yield new index_1.PostgreSQL().getClient();
            const userRepo = new user_repo_1.UserRepo(db);
            try {
                if (!((_a = req.item) === null || _a === void 0 ? void 0 : _a.username))
                    throw new Error(`Username is not defined.`);
                if (!req.item.email_address)
                    throw new Error(`Email address is not defined.`);
                if (!req.item.password)
                    throw new Error(`Password is not defined.`);
                const countByUsername = yield userRepo.countByUsername((_b = req.item) === null || _b === void 0 ? void 0 : _b.username);
                if (countByUsername > 0)
                    throw new Error(`Username is already in use.`);
                const countByEmailAddress = yield userRepo.countByEmailAddress(req.item.email_address);
                if (countByEmailAddress > 0)
                    throw new Error(`Email address is already in use.`);
                const userFactory = new user_factory_1.UserFactory();
                const newUser = yield userFactory.create(Object.assign({}, req.item));
                const userDehydrated = domainconverter_1.DomainConverter.toDto(newUser);
                const repoResult = yield userRepo.createOne(userDehydrated);
                const userHydrated = domainconverter_1.DomainConverter.fromDto(user_model_1.UserModel, repoResult.rows[0]);
                const ttl = new Date().getTime() + 24 * 60 * 60 * 1000;
                const token = (0, token_1.encodeToken)(userHydrated.id, token_1.tokenType.ACTIVATION, ttl);
                const emailMessageService = new email_message_service_1.EmailMessageService();
                yield emailMessageService.sendActivation(userHydrated, token);
                console.log(userHydrated);
                res.setItem(userHydrated);
                res.setSuccess(true);
            }
            catch (e) {
                res.setError(e);
            }
            db.release();
            return res;
        });
    }
    activate(req) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const res = new service_responses_1.UserActivationResponse();
            const db = yield new index_1.PostgreSQL().getClient();
            try {
                const encryptedEncodedToken = (_a = req.item) === null || _a === void 0 ? void 0 : _a.token;
                const payload = (0, token_1.decodeToken)(encryptedEncodedToken);
                if (payload.type !== token_1.tokenType.ACTIVATION)
                    throw new Error(`Token type is not activation.`);
                const now = new Date().getTime();
                if (payload.ttl < now)
                    throw new Error(`Token expired.`);
                const userRepo = new user_repo_1.UserRepo(db);
                const findResult = yield userRepo.findOneById(payload.id);
                if (findResult.rowCount < 1)
                    throw new Error(`User not found.`);
                const userHydrated = domainconverter_1.DomainConverter.fromDto(user_model_1.UserModel, findResult.rows[0]);
                if (userHydrated.date_activated !== null)
                    throw new Error(`User previously activated.`);
                userHydrated.setDateActivated(new Date());
                const userDehydrated = domainconverter_1.DomainConverter.toDto(userHydrated);
                const updateResult = yield userRepo.updateOneById(userDehydrated);
                const activatedUser = updateResult.rows[0];
                res.setItem(activatedUser);
                res.setSuccess(true);
            }
            catch (e) {
                res.setError(e);
            }
            db.release();
            return res;
        });
    }
    authenticate(req) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const res = new service_responses_1.UserAuthenticationResponse();
            const db = yield new index_1.PostgreSQL().getClient();
            const postgreSQL = new index_1.PostgreSQL();
            try {
                if (!((_a = req.item) === null || _a === void 0 ? void 0 : _a.email_address))
                    throw new Error(`Email address is not defined.`);
                if (!req.item.password)
                    throw new Error(`Password is not defined.`);
                const queryResult = yield postgreSQL.authenticate(req.item);
                if (queryResult.rowCount !== 1)
                    throw new Error(`Unable to authenticate user.`);
                const userId = queryResult.rows[0].id;
                const ttl = new Date().getTime() + 24 * 60 * 60 * 1000;
                const token = (0, token_1.encodeToken)(userId, token_1.tokenType.ACCESS, ttl);
                const auth = new authentication_model_1.AuthenticationModel({ token: token });
                res.setItem(auth);
                res.setSuccess(true);
            }
            catch (e) {
                res.setError(e);
            }
            db.release();
            return res;
        });
    }
}
exports.UserService = UserService;
//# sourceMappingURL=user-service.js.map