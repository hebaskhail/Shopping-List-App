const { checkSchema, validationResult } = require('express-validator');

/**
 * Validation schema for adding a new product.
 * All fields are required and must be valid.
 */
const addProductSchema = checkSchema({
    name: {
        in: ['body'],
        exists: {
            errorMessage: 'Name is required',
        },
        isString: {
            errorMessage: 'Name must be a string',
        },
    },
    quantity: {
        in: ['body'],
        exists: {
            errorMessage: 'Quantity is required',
        },
        isInt: {
            options: { min: 0 },
            errorMessage: 'Quantity must be an integer >= 0',
        },
    },
    price: {
        in: ['body'],
        exists: {
            errorMessage: 'Price is required',
        },
        isFloat: {
            options: { gt: 0 },
            errorMessage: 'Price must be a number greater than 0',
        },
    },
});

/**
 * Validation schema for updating an existing product.
 * All fields are optional, but if provided, must be valid.
 */
const updateProductSchema = checkSchema({
    name: {
        in: ['body'],
        optional: true,
        isString: {
            errorMessage: 'Name must be a string',
        },
    },
    quantity: {
        in: ['body'],
        optional: true,
        isInt: {
            options: { min: 0 },
            errorMessage: 'Quantity must be an integer >= 0',
        },
    },
    price: {
        in: ['body'],
        optional: true,
        isFloat: {
            options: { gt: 0 },
            errorMessage: 'Price must be a number greater than 0',
        },
    },
});



module.exports = {
    addProductSchema,
    updateProductSchema
};
