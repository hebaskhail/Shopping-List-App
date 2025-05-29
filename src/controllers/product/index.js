const AppError = require('../../utils/AppError');
const ResponseHandler = require('../../utils/ResponseHandler');
const productService = require('../../services/product');

exports.addProduct = (req, res, next) => {
    try {

        const result = productService.addProduct(req.body);

        if (!result.success) {
            throw new AppError(result.message, result.statusCode);
        }

        ResponseHandler.success(res, result.message, result.data, result.statusCode);

    } catch (error) {
        console.log("error", error);
        next(error);
    }
};

exports.updateProduct = (req, res, next) => {
    try {
        const result = productService.updateProduct({ id: parseInt(req.params.id), ...req.body });
        if (!result.success) {
            throw new AppError(result.message, result.statusCode);
        }

        ResponseHandler.success(res, result.message, result.data, result.statusCode);

    } catch (error) {
        console.log("error", error);
        next(error);
    }
};

exports.deleteProduct = (req, res, next) => {
    try {
        const result = productService.deleteProduct(parseInt(req.params.id));
        if (!result.success) {
            throw new AppError(result.message, result.statusCode);
        }

        ResponseHandler.success(res, result.message, result.data, result.statusCode);

    } catch (error) {
        next(error);
    }
};


exports.getAllProducts = (req, res, next) => {
    try {
        const result = productService.getAllProducts(req.query);
        if (!result.success) {
            throw new AppError(result.message, result.statusCode);
        }
        ResponseHandler.success(res, result.message, result.data, result.statusCode);
    } catch (error) {
        next(error);
    }
}
