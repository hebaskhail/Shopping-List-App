const { shoppingList, ShoppingListItem } = require('../../models/ShoppingList');
const { findProductById } = require('../../models/Product');


function addProductToShoppingList(productId) {
    const product = findProductById(productId);

    if (!product) {
        return {
            success: false,
            statusCode: 404,
            message: 'Product not found'
        };
    }

    if (product.quantity < 1) {
        return { success: false, statusCode: 400, message: 'No more stock available to add this product' }
    }

    if (shoppingList.items.has(productId)) {
        const item = shoppingList.items.get(productId);


        item.quantity += 1;
    } else {
        const item = new ShoppingListItem(productId, 1);
        shoppingList.items.set(productId, item);
    }

    // Deduct from available stock
    product.quantity -= 1;

    shoppingList.lastUpdated = new Date();

    return {
        success: true,
        statusCode: 200,
        message: 'Product added to shopping list',
        data: getShoppingList().data
    }

}


function removeProductFromShoppingList(productId) {
    const item = shoppingList.items.get(productId);
    if (!item) {
        return { success: false, statusCode: 404, message: 'Product not in shopping list' }
    }

    // Return quantity back to product list
    const product = findProductById(productId);
    if (product) {
        product.quantity += item.quantity;
    }

    shoppingList.items.delete(productId);
    shoppingList.lastUpdated = new Date();

    return {
        success: true,
        statusCode: 200,
        message: 'Product removed from shopping list',
        data: getShoppingList().data
    }
}

function getShoppingList() {
    const result = [];

    for (const [productId, item] of shoppingList.items.entries()) {
        const product = findProductById(productId);

        // If the product has been deleted From the product list, remove it from the list
        if (!product) {
            shoppingList.items.delete(productId);
            continue;
        }

        result.push({
            productId,
            name: product.name,
            quantity: item.quantity,
            price: product.price,
            subTotal: Number((item.quantity * product.price).toFixed(2))
        });
    }

    const total = shoppingList.calculateTotal();
    return {
        success: true,
        statusCode: 200,
        message: 'Shopping list retrieved successfully',
        data: {
            items: result,
            total
        }
    }

}

module.exports = {
    addProductToShoppingList,
    removeProductFromShoppingList,
    getShoppingList
}
