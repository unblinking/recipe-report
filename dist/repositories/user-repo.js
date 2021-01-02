"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepo = void 0;
const base_repo_1 = require("./base-repo");
const USERS_TABLE = `users`;
class UserRepo extends base_repo_1.BaseRepo {
    constructor(db) {
        super(db, USERS_TABLE);
    }
}
exports.UserRepo = UserRepo;
//# sourceMappingURL=user-repo.js.map