const { query } = require('express-validator');

const paginationSchema = [
    query('offset')
        .optional()
        .default(0)
        .toInt()
        .isInt({ min: 0 })
        .withMessage('Offset must be greater than or equal to 0'),

    query('limit')
        .optional()
        .default(10)
        .toInt()
        .isInt({ min: 1, max: 100 }) // Validate range
        .withMessage('Limit must be between 1 and 100')
];

module.exports = {
    paginationSchema
};
