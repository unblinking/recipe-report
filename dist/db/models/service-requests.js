"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRegistrationRequest = void 0;
class ServiceRequest {
    constructor(item, user) {
        this.state = {};
        this.setItem(item);
        this.setUser(user);
    }
    get item() {
        return this.state.item;
    }
    setItem(item) {
        this.state.item = item;
    }
    get user() {
        return this.state.user;
    }
    setUser(user) {
        this.state.user = user;
    }
}
class UserRegistrationRequest extends ServiceRequest {
    constructor(username, email_address, password) {
        super();
        const item = {
            username: username,
            email_address: email_address,
            password: password,
        };
        super.setItem(item);
    }
}
exports.UserRegistrationRequest = UserRegistrationRequest;
//# sourceMappingURL=service-requests.js.map