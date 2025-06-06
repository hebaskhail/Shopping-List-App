const express = require('express');
const routesVersioning = require('express-routes-versioning')();

const router = express.Router();

router.use(
    '/auth',
    routesVersioning({
        '^1.0.0': require('./v1/auth'),
    }),
);

router.use(
    '/product',
    routesVersioning({
        '^1.0.0': require('./v1/product'),
    }),
);

router.use(
    '/shopping-list',
    routesVersioning({
        '^1.0.0': require('./v1/shoppingList'),
    }),
);
module.exports = router;
