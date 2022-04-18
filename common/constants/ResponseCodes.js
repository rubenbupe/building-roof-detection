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

exports.USER_NOT_EXIST = 'User does not exist';
exports.USER_ALREADY_EXIST = 'User already exists';
exports.USER_NOT_ACTIVE = 'User is not active';
exports.USER_INVALID_PASSWORD = 'Wrong password';
exports.USER_REFRESH_TOKEN_NOT_PROVIDED = 'No refresh token provided';
exports.USER_EMAIL_ALREADY_VERIFIED = 'User email is already verified';
exports.USER_SENT_VERIFICATION_CODE = 'Sent verification code';
exports.USER_INVALID_TOKEN = 'Invalid token';

exports.FILE_NOT_EXIST = 'File does not exist';

exports.AUTH_REFRESH_TOKEN_NOT_PROVIDED = 'Refresh token not provided';
exports.AUTH_ACCESS_TOKEN_NOT_PROVIDED = 'Access token not provided';
exports.AUTH_INVALID_REFRESH_TOKEN = 'Refresh token is not valid';
exports.AUTH_INVALID_ACCESS_TOKEN = 'Access token is not valid';
exports.AUTH_INVALID_PERMISSIONS = 'You do not have permissions to perform this action';

exports.PLAN_ALREADY_SUBSCRIBED = 'You already have a subscription'

exports.APPOINTMENT_NO_APPOINTMENTS = 'No appointments';
exports.APPOINTMENT_NO_RATABLE = 'Appointment is not ratable';
exports.APPOINTMENT_NO_AVAILABLE = 'Appointment not available';
exports.APPOINTMENT_NO_NEXT_APPOINTMENT = 'You do not have any appointment';
exports.APPOINTMENT_NO_MODIFIABLE = 'You cannot modify an appointment that is less than 24 hours away';
exports.APPOINTMENT_ALREADY_EXIST = 'Appointment already exists';
exports.APPOINTMENT_ALREADY_SET = 'You already have an appointment';
exports.APPOINTMENT_ALREADY_ASSIGNED = 'This appointment is already assigned to an user';
exports.AVAILABILITY_NOT_MODIFIABLE = 'Cannot modify availability for dates that are less than 24 hours away';
exports.AVAILABILITY_REPEATED = 'Cannot both delete and create availability for the same date and time';
exports.AVAILABILITY_ASSIGNED = 'Cannot delete an appointment already assigned to a patient. Your calendar may be outdated, refresh the page';
exports.AVAILABILITY_ALREADY_EXISTS = 'One or more of the date and times provided are already marked as available';
exports.AVAILABILITY_OUT_OF_SCHEDULE = 'One or more of the date and times provided are out of the schedule';

exports.EMOTIONS_MAX_REACHED = 'You have reached the maximum number of emotions per day';
exports.EMOTIONS_INVALID_DATE = 'Invalid date';
exports.EMOTIONS_NO_PREMIUM = 'Premium needed to perform this request';
exports.EMOTIONS_START_DATE_BEFORE_END = 'Start date must not be after end date';
exports.EMOTIONS_RANGE_TOO_LARGE = (p) => `Range must be less than ${p} days`;

exports.VALIDATOR_SHOULD_BE_STRING = 'Should be string';
exports.VALIDATOR_SHOULD_BE_NUMBER = 'Should be number';
exports.VALIDATOR_INVALID_AVAILABILITY_FORMAT = 'The format of the availability provided is invalid or not provided';
exports.VALIDATOR_INVALID_AVAILABILITY_TIMES = 'Times provided are not valid';
exports.VALIDATOR_INVALID_DATE_FORMAT = 'Invalid date format';
exports.VALIDATOR_INVALID_AGE = 'You must be 18 years old';
exports.VALIDATOR_NOT_PROVIDED_ = (p) => `${p} field not provided`;
exports.VALIDATOR_NOT_VALID_ = (p) => `${p} has an invalid value`;
exports.VALIDATOR_INVALID_LENGTH_ = (p, min, max) => `${p} length must be between ${min} and ${max} characters`;
exports.VALIDATOR_INVALID_CHARACTERS_ = (p) => `${p} contains invalid characters`;
exports.VALIDATOR_NOT_ASSERTING_CONDITIONS_PASSWORD = 'Password must contain at least two of these types of characters: ' +
    'number, lowercase letter, uppercase letter, special character';
exports.VALIDATOR_NOT_PROVIDED_FILE = "File not provided";
exports.VALIDATOR_INVALID_FILE_FIELD = "Invalid field";
exports.VALIDATOR_INVALID_FILE_TYPE = "Invalid file type";
exports.VALIDATOR_UNEXPECTED_FILE_ERROR = "Unexpected file error";
exports.VALIDATOR_LARGE_FILE = "File is too large (max. 10MB)";
exports.VALIDATOR_INVALID_FILE_COUNT = (p) => `Invalid field count, max. of ${p} files allowed`;
exports.VALIDATOR_INVALID_NUMBER_ = (p, max) => `You must provide between 0 and ${max} ${p}`;
exports.VALIDATOR_INVALID_RATE_START = (p) => `You must provide a number between 0 and ${p}`;
exports.VALIDATOR_INPUT_NOT_ALLOWED = `Input not allowed in this screen`;
exports.VALIDATOR_INVALID_INPUT = `Invalid input`;
exports.VALIDATOR_INVALID_OPTION = `Invalid option`;


exports.VALIDATOR_INVALID_FIELD_TYPE = `Invalid field type`;



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
