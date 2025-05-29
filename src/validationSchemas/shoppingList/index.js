const { body, param } = require('express-validator');
const { validateRequest } = require('../../middlewares/validators/validateRequest');

const addToShoppingListSchema = [
    param('productId')
        .notEmpty()
        .isInt({ min: 1 })
        .withMessage('Valid product ID is required'),
    validateRequest
];

const removeFromShoppingListSchema = [
    param('productId')
        .notEmpty()
        .isInt({ min: 1 })
        .withMessage('Valid product ID is required'),
    validateRequest
];

module.exports = {
    addToShoppingListSchema,
    removeFromShoppingListSchema
};
