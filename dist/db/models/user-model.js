"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
class UserModel {
    constructor(props) {
        this.state = {};
        this.setId(props.id);
        this.setUsername(props.username);
        this.setPassword(props.password);
        this.setEmailAddress(props.email_address);
        this.setDateCreated(props.date_created);
        this.setDateLastLogin(props.date_last_login);
        this.setDateDeleted(props.date_deleted);
    }
    get id() {
        return this.state.id;
    }
    setId(id) {
        this.state.id = id;
    }
    get username() {
        return this.state.username;
    }
    setUsername(username) {
        this.state.username = username;
    }
    get password() {
        return this.state.password;
    }
    setPassword(password) {
        this.state.password = password;
    }
    get email_address() {
        return this.state.email_address;
    }
    setEmailAddress(email_address) {
        this.state.email_address = email_address;
    }
    get date_created() {
        return this.state.date_created;
    }
    setDateCreated(date_created) {
        this.state.date_created = date_created;
    }
    get date_last_login() {
        return this.state.date_last_login;
    }
    setDateLastLogin(date_last_login) {
        this.state.date_last_login = date_last_login;
    }
    get date_deleted() {
        return this.state.date_deleted;
    }
    setDateDeleted(date_deleted) {
        this.state.date_deleted = date_deleted;
    }
}
exports.UserModel = UserModel;
//# sourceMappingURL=user-model.js.map