
const  ResponseHandler  = require('../utils/responseHandler');
const AppError  = require('../utils/AppError');

const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || 'Internal Server Error';

    // Handling specific types of errors
    if (err instanceof AppError) {
        return ResponseHandler.error(
            res,
            err.message,
            err.statusCode
        );
    }

    // Handle validation errors (express-validator)
    if (err.array && typeof err.array === 'function') {
        const validationErrors = err.array().map(error => ({
            field: error.path,
            message: error.msg
        }));
        return ResponseHandler.error(
            res,
            'Validation Error',
            400,
            validationErrors
        );
    }

    // Handle other errors
    if (process.env.NODE_ENV === 'development') {
        return ResponseHandler.error(
            res,
            err.message,
            err.statusCode,
            {
                stack: err.stack,
                error: err
            }
        );
    }
    // Production error response
    return ResponseHandler.error(
        res,
        'Sorry, Something Went Wrong!',
        500
    );
};

module.exports = errorHandler; 