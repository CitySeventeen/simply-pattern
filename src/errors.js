const LazyError = require('laziest-error');
const errors = new LazyError(TypeError);

errors.pattern_called_with_new = 'The pattern must not to be called with new operator';

const check = require('errformance')('dev');

module.exports = {errors, check};
