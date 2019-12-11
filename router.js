const express = require('express');
const router = express.Router();
const validate = require('express-validation');
const validation = require('./validation');

const productSearch = require('./endpoints/product-search');
const tokenSupplier = require('./endpoints/get-token');
const products = require('./endpoints/products');

router.post('/product-search', validate(validation.productSearch), new productSearch(tokenSupplier).search);
router.get('/products', validate(validation.products), products);

module.exports = router;
