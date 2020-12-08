"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DomainConverter = void 0;
class DomainConverter {
    static fromDto(domain, dto) {
        const instance = Object.create(domain.prototype);
        instance.state = dto;
        return instance;
    }
    static toDto(domain) {
        return domain.state;
    }
}
exports.DomainConverter = DomainConverter;
//# sourceMappingURL=domainconverter.js.map