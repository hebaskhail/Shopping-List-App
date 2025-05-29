// services/productService.js

const { Product, products, getNextId } = require('../../models/Product');

/**
 * Adds a new product to the in-memory store.
 */
function addProduct(data) {
    try {
        const { name, quantity, price } = data;
        const id = getNextId();
        const newProduct = new Product(id, name, parseInt(quantity, 10), parseFloat(price));
        products.set(id, newProduct);

        return {
            success: true,
            statusCode: 201,
            message: 'Product created successfully',
            data: newProduct
        }
    } catch (error) {
        return {
            message: error.message,
        };
    }
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
        return {
            success: false,
            statusCode: 404,
            message: 'Product not found',
            data: null
        };
    }



    // Check that at least one field is provided
    if (!name && quantity === undefined && price === undefined) {
        return {
            success: false,
            message: 'At least one field (name, quantity, price) is required to update',
            statusCode: 404,
        }
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
        return { success: false, message: 'Invalid product ID', statusCode: 402 };
    }

    if (!products.has(id)) {
        return { success: false, message: 'Product not found', statusCode: 404 };
    }

    products.delete(id);

    return {
        success: true,
        message: 'Product deleted successfully',
        statusCode: 200
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
            statusCode: 400
        };
    }

    // Slice for pagination
    const paginatedProducts = allProducts.slice(offset, offset + limit);

    return {

        data: {
            products: paginatedProducts,
            total: allProducts.length,
            offset,
            limit,
        },
        success: true
    };
};


module.exports = {
    addProduct,
    updateProduct,
    deleteProduct,
    getAllProducts,
};
