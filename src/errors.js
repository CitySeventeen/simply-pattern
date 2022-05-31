const LazyError = require('laziest-error');
const errors = new LazyError(TypeError);

errors.pattern_called_with_new = 'The pattern must not to be called with new operator';
errors.entity_wrong_type = 'Entity must to be an Object or Function';
errors.whereinject_wrong_type = 'Where Inject parameter must to be an object as handler of ProxyTracker';
errors.dependency_wrong_type = 'Dependency must to be an Object';

const check = require('errformance')('dev');

module.exports = {errors, check};
