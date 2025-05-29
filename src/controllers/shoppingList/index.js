const AppError = require('../../utils/AppError');
const ResponseHandler = require('../../utils/responseHandler');
const shoppingListService = require('../../services/shoppingList');

exports.addProductToList = (req, res, next) => {
    try {
        const { productId } = req.params;
        const result = shoppingListService.addProductToShoppingList(Number(productId));

        if (!result.success) {
            throw new AppError(result.message, result.statusCode);
        }

        ResponseHandler.success(res, result.message, result.data, result.statusCode);
    } catch (error) {
        next(error);
    }
};

exports.removeProductFromList = (req, res, next) => {
    try {
        const { productId } = req.params;
        const result = shoppingListService.removeProductFromShoppingList(Number(productId));

        if (!result.success) {
            throw new AppError(result.message, result.statusCode);
        }

        ResponseHandler.success(res, result.message, result.data, result.statusCode);
    } catch (error) {
        next(error);
    }
};

exports.getShoppingList = (req, res, next) => {
    try {
        const result = shoppingListService.getShoppingList();

        if (!result.success) {
            throw new AppError(result.message, result.statusCode);
        }

        ResponseHandler.success(res, result.message, result.data, result.statusCode);
    } catch (error) {
        next(error);
    }
};
