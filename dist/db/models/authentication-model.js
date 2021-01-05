"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationModel = void 0;
class AuthenticationModel {
    constructor(props) {
        this.state = {};
        this.setToken(props.token);
    }
    get token() {
        return this.state.token;
    }
    setToken(token) {
        this.state.token = token;
    }
}
exports.AuthenticationModel = AuthenticationModel;
//# sourceMappingURL=authentication-model.js.map