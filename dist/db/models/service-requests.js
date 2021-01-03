"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserActivationRequest = exports.UserRegistrationRequest = void 0;
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
    constructor(props) {
        super();
        const item = props;
        super.setItem(item);
    }
}
exports.UserRegistrationRequest = UserRegistrationRequest;
class UserActivationRequest extends ServiceRequest {
    constructor(props) {
        super();
        const item = props;
        super.setItem(item);
    }
}
exports.UserActivationRequest = UserActivationRequest;
//# sourceMappingURL=service-requests.js.map