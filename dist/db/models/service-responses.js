"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAuthenticationResponse = exports.UserActivationResponse = exports.UserRegistrationResponse = void 0;
class ServiceResponse {
    constructor(success = false, error, item) {
        this.state = {};
        this.setSuccess(success);
        this.setError(error);
        this.setItem(item);
    }
    get success() {
        return this.state.success;
    }
    setSuccess(success) {
        this.state.success = success;
    }
    get error() {
        return this.state.error;
    }
    setError(error) {
        this.state.error = error;
    }
    get item() {
        return this.state.item;
    }
    setItem(item) {
        this.state.item = item;
    }
}
class UserRegistrationResponse extends ServiceResponse {
}
exports.UserRegistrationResponse = UserRegistrationResponse;
class UserActivationResponse extends ServiceResponse {
}
exports.UserActivationResponse = UserActivationResponse;
class UserAuthenticationResponse extends ServiceResponse {
}
exports.UserAuthenticationResponse = UserAuthenticationResponse;
//# sourceMappingURL=service-responses.js.map