// services/productService.js

const { Product, products, getNextId } = require('../../models/product');

/**
 * Adds a new product to the in-memory store.
 */
function addProduct(data) {
    const { name, quantity, price } = data;
    const id = getNextId();
    const newProduct = new Product(id, name, parseInt(quantity, 10), parseFloat(price));
    products.set(id, newProduct);

    return newProduct;
}

/**
 * Updates an existing product by ID.
 */
function updateProduct(data) {
    const { id, name, quantity, price } = data;

    if (isNaN(id)) {
        return { success: false, message: 'Invalid product ID' };
    }

    const product = products.get(id);
    if (!product) {
        return { success: false, message: 'Product not found' };
    }


    // Check that at least one field is provided
    if (!name && quantity === undefined && price === undefined) {
        return {
            success: false,
            message: 'At least one field (name, quantity, price) is required to update'
        };
    }

    // Update provided fields
    if (name !== undefined) product.name = name;
    if (quantity !== undefined) product.quantity = parseInt(quantity, 10);
    if (price !== undefined) product.price = parseFloat(price);

    products.set(id, product);

    return {
        success: true,
        message: 'Product updated successfully',
        data: product
    };
}

/**
 * Deletes a product by ID.
 */
function deleteProduct(id) {

    if (isNaN(id)) {
        return { success: false, message: 'Invalid product ID' };
    }

    if (!products.has(id)) {
        return { success: false, message: 'Product not found' };
    }

    products.delete(id);

    return {
        success: true,
        message: 'Product deleted successfully'
    };
}

/**
 * Returns all products as an array.
 */
function getAllProducts(data) {
    const { offset, limit } = data;

    // Convert products Map to array
    const allProducts = Array.from(products.values());

    // Validate offset and limit
    if (offset < 0 || limit <= 0) {
        return {
            success: false,
            message: 'Offset must be >= 0 and limit must be > 0',
        };
    }

    // Slice for pagination
    const paginatedProducts = allProducts.slice(offset, offset + limit);

    return {
        total: allProducts.length,
        offset,
        limit,
        data: paginatedProducts,
    };
};


module.exports = {
    addProduct,
    updateProduct,
    deleteProduct,
    getAllProducts,
};
