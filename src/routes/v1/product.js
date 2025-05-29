const express = require('express');
const router = express.Router();

const userAuth = require('../../middlewares/auth/userAuth');
const { addProductSchema, updateProductSchema } = require('../../validationSchemas/product');
const { validateRequest } = require('../../middlewares/validators/validateRequest');
const { addProduct, updateProduct, deleteProduct, getAllProducts } = require('../../controllers/product');


// All routes protected by user auth
router.use(userAuth);

// GET /products?offset=0&limit=10
router.get('/', getAllProducts);

// POST /products
router.post('/', addProductSchema, validateRequest, addProduct);

// PUT /products/:id
router.put('/:id', updateProductSchema, validateRequest, updateProduct);

// DELETE /products/:id
router.delete('/:id', deleteProduct);

module.exports = router;
