const { checkSchema, validationResult } = require('express-validator');
const { body, param } = require('express-validator');
const { validateRequest } = require('../../middlewares/validators/validateRequest');

/**
 * Validation schema for adding a new product.
 * All fields are required and must be valid.
 */
const addProductSchema = [
    body('name')
        .exists({ checkFalsy: true })
        .withMessage('Name is required')
        .isString()
        .withMessage('Name must be a string'),

    body('quantity')
        .exists({ checkFalsy: true })
        .withMessage('Quantity is required')
        .isInt({ min: 0 })
        .withMessage('Quantity must be a non-negative integer'),

    body('price')
        .exists({ checkFalsy: true })
        .withMessage('Price is required')
        .isFloat({ gt: 0 })
        .withMessage('Price must be a number greater than 0'),

    validateRequest
];



/**
 * Validation schema for updating an existing product.
 * All fields are optional, but if provided, must be valid.
 */
const updateProductSchema = [
    body('name')
        .optional()
        .isString()
        .withMessage('Name must be a string'),

    body('quantity')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Quantity must be a non-negative integer'),

    body('price')
        .optional()
        .isFloat({ gt: 0 })
        .withMessage('Price must be a number greater than 0'),

    validateRequest
];




module.exports = {
    addProductSchema,
    updateProductSchema
};
