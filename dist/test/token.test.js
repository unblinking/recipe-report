"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_factory_1 = require("./test-factory");
const token_1 = require("../wrappers/token");
describe(`JSON Web Token actions.`, () => {
    test(`Encodes an activation JWT.`, () => {
        const testFactory = new test_factory_1.TestFactory();
        const userDto = testFactory.userNewDto();
        const token = (0, token_1.encodeToken)(userDto.id, token_1.tokenType.ACTIVATION, new Date().getTime());
        expect(token).toBeTruthy();
    });
    test(`Encodes an access JWT.`, () => {
        const testFactory = new test_factory_1.TestFactory();
        const userDto = testFactory.userNewDto();
        const token = (0, token_1.encodeToken)(userDto.id, token_1.tokenType.ACCESS, new Date().getTime());
        expect(token).toBeTruthy();
    });
    test(`Encodes an access JWT even when TTL is not defined.`, () => {
        const testFactory = new test_factory_1.TestFactory();
        const userDto = testFactory.userNewDto();
        const token = (0, token_1.encodeToken)(userDto.id, token_1.tokenType.ACCESS);
        expect(token).toBeTruthy();
    });
    test(`Decodes an activation JWT.`, () => {
        const testFactory = new test_factory_1.TestFactory();
        const token = testFactory.tokenActivation();
        const payload = (0, token_1.decodeToken)(token);
        expect(payload.id).toBeTruthy();
        expect(payload.type).toEqual(token_1.tokenType.ACTIVATION);
        expect(payload.iat).toBeTruthy();
        expect(payload.ttl).toBeTruthy();
    });
    test(`Decodes an access JWT.`, () => {
        const testFactory = new test_factory_1.TestFactory();
        const token = testFactory.tokenAccess();
        const payload = (0, token_1.decodeToken)(token);
        expect(payload.id).toBeTruthy();
        expect(payload.type).toEqual(token_1.tokenType.ACCESS);
        expect(payload.iat).toBeTruthy();
        expect(payload.ttl).toBeTruthy();
    });
    test(`Fails to encode without JWT_SECRET.`, () => {
        const testFactory = new test_factory_1.TestFactory();
        const userDto = testFactory.userNewDto();
        const backupJwtSecret = process.env.JWT_SECRET;
        delete process.env.JWT_SECRET;
        expect(() => {
            (0, token_1.encodeToken)(userDto.id, token_1.tokenType.ACCESS, new Date().getTime());
        }).toThrow(`JWT error. Secret key is not defined.`);
        process.env.JWT_SECRET = backupJwtSecret;
    });
    test(`Fails to encode without User ID.`, () => {
        expect(() => {
            (0, token_1.encodeToken)(``, token_1.tokenType.ACCESS, new Date().getTime());
        }).toThrow(`JWT error. User ID is not defined.`);
    });
    test(`Fails to encode without token type.`, () => {
        const testFactory = new test_factory_1.TestFactory();
        const userDto = testFactory.userNewDto();
        expect(() => {
            (0, token_1.encodeToken)(userDto.id, token_1.tokenType.NONE, new Date().getTime());
        }).toThrow(`JWT error. Type is not defined.`);
    });
    test(`Fails to decodes without JWT_SECRET.`, () => {
        const testFactory = new test_factory_1.TestFactory();
        const token = testFactory.tokenActivation();
        const backupJwtSecret = process.env.JWT_SECRET;
        delete process.env.JWT_SECRET;
        expect(() => {
            (0, token_1.decodeToken)(token);
        }).toThrow(`JWT error. Secret key is not defined.`);
        process.env.JWT_SECRET = backupJwtSecret;
    });
    test(`Fails to decodes without token.`, () => {
        expect(() => {
            (0, token_1.decodeToken)(``);
        }).toThrow(`JWT error. Token is not defined.`);
    });
});
//# sourceMappingURL=token.test.js.map