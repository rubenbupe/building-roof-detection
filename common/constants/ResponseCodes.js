const {_MSG_KEY, _CODE_KEY, _PARAMS_KEY} = require('./ResponseKeys');

exports.SUCCESS = 'Success';
exports.CREATED = 'Created';
exports.UPDATED = 'Updated';
exports.DELETED = 'Deleted';
exports.NOT_EXIST = 'Resource does not exist';
exports.SERVER_ERROR = 'Unexpected error, retry later or contact support';
exports.REQUEST_ERROR = 'Request error';
exports.BAD_REQUEST = 'Bad request';
exports.OUTDATED_CLIENT = 'Outdated client';


module.exports = function(){
    const formatted_codes = {};

    for (let [key, value] of Object.entries(module.exports)) {
        if(typeof value !== 'function') {
            formatted_codes[key] = {[_CODE_KEY]: key, [_MSG_KEY]: value};
        }else if(key.endsWith('_')){
            formatted_codes[key] = (args) => {
                return {[_CODE_KEY]: key + args[0].toString().toUpperCase().replace(' ', '_'),
                    [_MSG_KEY]: value(...args),
                    [_PARAMS_KEY]: args,
                }};
        }else{
            formatted_codes[key] = (args) => {return {[_CODE_KEY]: key , [_MSG_KEY]: value(...args)}};
        }
    }
    return formatted_codes;
}();
