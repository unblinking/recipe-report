/**
 * Unit tests required in order of execution.
 */

/**
 * Route tests.
 * A new email and password are set as environmental variables for shared access
 * by the route unit tests.
 */
process.env.MOCHA_USERNAME = new Date().getTime() + "@grocereport.com";
process.env.MOCHA_PASSWORD = new Date().getTime();
require("./routes/root");
require("./routes/register");
require("./routes/login");
require("./routes/test");

/**
 * jsonwebtoken tests.
 */
require("./jwt/generateToken");
