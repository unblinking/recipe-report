'use strict';

// Using a JavaScript-based config file.
// Useful if conditional logic is needed.

module.exports = {
  exit: 'true',
  reporter: 'dot',
  require: ['env-test', 'should'],
  timeout: 20000,
  ui: 'bdd',
};
