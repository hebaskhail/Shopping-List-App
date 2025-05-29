const express = require('express');
const router = express.Router();
const shoppingListController = require('../../controllers/shoppingList');
const { addToShoppingListSchema, removeFromShoppingListSchema } = require('../../validationSchemas/shoppingList');

// Add a product to the shopping list
router.post('/:productId', addToShoppingListSchema, shoppingListController.addProductToList);

// Remove a product from the shopping list
router.delete('/:productId', removeFromShoppingListSchema, shoppingListController.removeProductFromList);

// Get the current shopping list
router.get('/', shoppingListController.getShoppingList);

module.exports = router;
