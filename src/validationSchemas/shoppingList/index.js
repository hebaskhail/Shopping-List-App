const { body } = require('express-validator');
const { validateRequest } = require('../../middlewares/validators/validateRequest');

const addToShoppingListSchema = [
    body('productId')
        .notEmpty()
        .isInt({ min: 1 })
        .withMessage('Valid product ID is required'),
    validateRequest
];

const removeFromShoppingListSchema = [
    body('productId')
        .notEmpty()
        .isInt({ min: 1 })
        .withMessage('Valid product ID is required'),
    validateRequest
];

module.exports = {
    addToShoppingListSchema,
    removeFromShoppingListSchema
};
