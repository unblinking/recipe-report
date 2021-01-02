"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRegistrationRequest = exports.IUserRegistrationRequest = void 0;
class IUserRegistrationRequest {
}
exports.IUserRegistrationRequest = IUserRegistrationRequest;
class UserRegistrationRequest {
    constructor(username, email_address, password) {
        this.state = {};
        this.setUsername(username);
        this.setEmailAddress(email_address);
        this.setPassword(password);
    }
    get username() {
        return this.state.username;
    }
    setUsername(username) {
        this.state.username = username;
    }
    get email_address() {
        return this.state.email_address;
    }
    setEmailAddress(email_address) {
        this.state.email_address = email_address;
    }
    get password() {
        return this.state.password;
    }
    setPassword(password) {
        this.state.password = password;
    }
}
exports.UserRegistrationRequest = UserRegistrationRequest;
//# sourceMappingURL=requests.js.map