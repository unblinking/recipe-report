"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailMessageModel = void 0;
class EmailMessageModel {
    constructor(from, to, subject, body) {
        this.state = {};
        this.set_from(from);
        this.set_to(to);
        this.set_subject(subject);
        this.set_body(body);
    }
    get from() {
        return this.state.from;
    }
    set_from(from) {
        this.state.from = from;
    }
    get to() {
        return this.state.to;
    }
    set_to(to) {
        this.state.to = to;
    }
    get subject() {
        return this.state.subject;
    }
    set_subject(subject) {
        this.state.subject = subject;
    }
    get body() {
        return this.state.body;
    }
    set_body(body) {
        this.state.body = body;
    }
}
exports.EmailMessageModel = EmailMessageModel;
//# sourceMappingURL=email-message-model.js.map