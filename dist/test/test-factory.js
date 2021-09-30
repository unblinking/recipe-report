"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestFactory = void 0;
const user_model_1 = require("../db/models/user-model");
const userId = `9aa98e23-24ec-4403-8517-ca27968cfe25`;
class TestFactory {
    userNewDto() {
        const userDto = {
            id: userId,
            username: `noreplyuser`,
            password: `$2a$08$PPhEIhC/lPgUMRAXpvrYL.ehrApeV7pdsGU6/DSufUFvuhiFtqR4C`,
            email_address: `noreply@recipe.report`,
            date_created: new Date(),
        };
        return userDto;
    }
    userNew() {
        const userDto = this.userNewDto();
        const user = new user_model_1.UserModel(userDto);
        return user;
    }
    userActivated() {
        const user = this.userNew();
        user.setDateActivated(new Date());
        return user;
    }
    tokenActivation() {
        const token = `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.ImNibEZSdVFwK044RFJ4akM4aW5uckZSaU1LVmpVYUVzb09xQmdwelc1Mjljdm9jLzBSMFZ4dFVmakdraTlWeXF2MHFvcU5Zdmd0aW1haFl6dHlMckRPY1Nrb0ZnanJ5Y0xDWno2Y1pBQXlYTzgxdi9kRE5WNkF3K3BkcXhqZXlTOWxtbEx0d2NZbG1HVFpZY2NjRUhKQT09Ig.fyE3vPgWjQawr68z2OtPT-pGtp43q04UKF5zlo9u4LU5bBb_Sg-5GqBbLFy9UiV_FJJIaSwrIe757fTNEvfeUw`;
        return token;
    }
    tokenAccess() {
        const token = `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.IkkvcGgyZGwrNDllclByWkxYZWpCZVVIaXFUbW1HMEZyNEFRQkRDdTlERlZmZWZBN2Jkb0hpT2xzNmJvTkhFTkovTDNCNjhjNG0rUWphYWtrM3YzT09vUWdNSm1ib0ZKQlQ1ZHVNS1JVVXA2NDJ6bkxWaEp6am5KK3pQWXU1N29GNnJ6YVZ0L3BQdWpjenJpRTVsSS9EUT09Ig.JzmOzo2oTy9Bt2bHmZbWypUG4pnR9KXnVsoagcioBDTcoJutgkhEzSxqyIFY9you73c2z6-4dS9wc8H8F4o_Pw`;
        return token;
    }
}
exports.TestFactory = TestFactory;
//# sourceMappingURL=test-factory.js.map