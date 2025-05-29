const { findProductById } = require('./Product');

class ShoppingListItem {
    constructor(productId, quantity) {
        this.productId = Number(productId);
        this.quantity = quantity;
    }
}

class ShoppingList {
    constructor() {
        this.items = new Map(); // productId -> ShoppingListItem
        this.lastUpdated = new Date();
    }

    calculateTotal() {
        let total = 0;
        for (const item of this.items.values()) {
            const product = findProductById(item.productId);
            if (product) {
                total += item.quantity * product.price;
            }
        }
        return Number(total.toFixed(2));
    }
}

// In-memory shopping list for the single user
const shoppingList = new ShoppingList();

module.exports = {
    ShoppingListItem,
    shoppingList
};
