const LazyError = require('laziest-error');
const errors = new LazyError(TypeError);

errors.pattern_called_with_new = 'The pattern must not to be called with new operator';
errors.entity_wrong_type = 'Entity must to be an Object or Function';
errors.whereinject_wrong_type = 'Where Inject parameter must to be an Object or Function';
errors.dependency_whereinject_wrong_type = 'Where Inject parameter must to be a function when dependency parameter is present';
errors.wrong_trap_name = 'The trap name must to be apply or construct';
errors.wrong_list_returned_by_trap = 'The where inject trap must to be returned a list o args';
errors.wrong_element_in_handler = 'where inject must to have function, or object or array element';

const check = require('errformance')('dev');

module.exports = {errors, check};
