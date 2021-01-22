"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const test_factory_1 = require("./test-factory");
const domainconverter_1 = require("../db/models/domainconverter");
const token_1 = require("../wrappers/token");
test(`encode`, () => __awaiter(void 0, void 0, void 0, function* () {
    const testFactory = new test_factory_1.TestFactory();
    const user = yield testFactory.userNew();
    const userDto = domainconverter_1.DomainConverter.toDto(user);
    const token = token_1.encodeToken(userDto.id, token_1.tokenType.ACCESS, new Date().getTime());
    expect(token).toBeTruthy;
}));
test(`decode`, () => __awaiter(void 0, void 0, void 0, function* () {
}));
//# sourceMappingURL=token.test.js.map