"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UserModel {
    constructor(id, username, password, email, date_created, date_last_login, date_deleted) {
        this._id = id;
        this._username = username;
        this._password = password;
        this._email = email;
        this._date_created = date_created;
        this._date_last_login = date_last_login;
        this._date_deleted = date_deleted;
    }
    get id() {
        return this._id;
    }
    set id(id) {
        this._id = id;
    }
    get username() {
        return this._username;
    }
    set username(username) {
        this._username = username;
    }
    get password() {
        return this._password;
    }
    set password(password) {
        this._password = password;
    }
    get email() {
        return this._email;
    }
    set email(email) {
        this._email = email;
    }
    get date_created() {
        return this._date_created;
    }
    set date_created(date_created) {
        this._date_created = date_created;
    }
    get date_last_login() {
        return this._date_last_login;
    }
    set date_last_login(date_last_login) {
        this._date_last_login = date_last_login;
    }
    get date_deleted() {
        return this._date_deleted;
    }
    set date_deleted(date_deleted) {
        this._date_deleted = date_deleted;
    }
}
exports.default = UserModel;
//# sourceMappingURL=user.js.map