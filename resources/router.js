const express = require('express');
const router = express.Router();
const validate = require('express-validation');
const validation = require('./validation');

const productSearch = require('./endpoints/product-search');
const products = require('./endpoints/products');

router.post('/product-search', validate(validation.productSearch), productSearch);
router.get('/products', validate(validation.products), products);

module.exports = router;
