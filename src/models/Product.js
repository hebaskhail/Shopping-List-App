
class Product {
  constructor(id, name, quantity, price) {
    this.id = id;
    this.name = name;
    this.quantity = quantity;
    this.price = price;
  }

}

const products = new Map();
let currentId = 0;

/**
 * Returns the next unique product ID.
 * @returns {number}
 */
function getNextId() {
  currentId += 1;
  return currentId;
}

function findProductById(productId) {
  const id = Number(productId);
  return products.get(id);
}

module.exports = { Product, products, getNextId, findProductById };
