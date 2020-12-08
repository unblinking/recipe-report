"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
class UserModel {
    constructor(id, username, password, email, date_created, date_last_login, date_deleted) {
        this.state = {};
        this.set_id(id);
        this.set_username(username);
        this.set_password(password);
        this.set_email(email);
        this.set_date_created(date_created);
        this.set_date_last_login(date_last_login);
        this.set_date_deleted(date_deleted);
    }
    get id() {
        return this.state.id;
    }
    set_id(id) {
        this.state.id = id;
    }
    get username() {
        return this.state.username;
    }
    set_username(username) {
        this.state.username = username;
    }
    get password() {
        return this.state.password;
    }
    set_password(password) {
        this.state.password = password;
    }
    get email() {
        return this.state.email;
    }
    set_email(email) {
        this.state.email = email;
    }
    get date_created() {
        return this.state.date_created;
    }
    set_date_created(date_created) {
        this.state.date_created = date_created;
    }
    get date_last_login() {
        return this.state.date_last_login;
    }
    set_date_last_login(date_last_login) {
        this.state.date_last_login = date_last_login;
    }
    get date_deleted() {
        return this.state.date_deleted;
    }
    set_date_deleted(date_deleted) {
        this.state.date_deleted = date_deleted;
    }
}
exports.UserModel = UserModel;
//# sourceMappingURL=usermodel.js.map