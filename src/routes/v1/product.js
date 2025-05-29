const express = require('express');
const router = express.Router();

const userAuth = require('../../middlewares/auth/userAuth');
const { addProductSchema, updateProductSchema } = require('../../validationSchemas/product');
const { validateRequest } = require('../../middlewares/validators/validateRequest');
const { addProduct, updateProduct, deleteProduct, getAllProducts } = require('../../controllers/product');
const { paginationSchema } = require('../../validationSchemas/paginationSchema');

// All routes protected by user auth
router.use(userAuth);

// GET /products?offset=0&limit=10
router.get('/', paginationSchema, validateRequest, getAllProducts);

// POST /products
router.post('/', addProductSchema, addProduct);

// PUT /products/:id
router.put('/:id', updateProductSchema, updateProduct);

// DELETE /products/:id
router.delete('/:id', deleteProduct);

module.exports = router;
