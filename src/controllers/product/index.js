// controllers/productController.js
const productService = require('../../services/product');

exports.addProduct = (req, res) => {
    try {

        const product = productService.addProduct(req.body);
        res.status(201).json({ success: true, product });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

exports.updateProduct = (req, res) => {
    try {
        const product = productService.updateProduct({ id: parseInt(req.params.id), ...req.body });
        res.status(200).json({ success: true, product });
    } catch (err) {
        res.status(404).json({ success: false, message: err.message });
    }
};

exports.deleteProduct = (req, res) => {
    try {
        productService.deleteProduct(parseInt(req.params.id));
        res.status(200).json({ success: true, message: 'Product deleted successfully' });
    } catch (err) {
        res.status(404).json({ success: false, message: err.message });
    }
};

exports.getAllProducts = (req, res) => {

    const data = productService.getAllProducts(req.query);
    res.status(200).json(data);
};
