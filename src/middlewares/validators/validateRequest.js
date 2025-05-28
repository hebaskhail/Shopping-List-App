const { validationResult } = require('express-validator');


module.exports.validateRequest = async (req, res, next) => {
    const validationResults = await validationResult(req);

    if (validationResults.isEmpty()) {
        return next();
    }

    const errors = validationResults.array().map((error) => {
        if (error.msg === 'Invalid value(s)') {
            return {
                key: error.param,
                message: error.nestedErrors,
                type: 'message',
            };
        }

        return {
            key: error.param,
            message: error.msg,
            type: 'message',
        };
    });

    if (errors.length === 1) {
        [errors] = errors;
    }

    return next(errors);
};
