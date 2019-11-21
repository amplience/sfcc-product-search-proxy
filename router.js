var express = require('express');
var router = express.Router();

var productSearch = require('./endpoints/product-search');

router.post('/product-search', productSearch);

module.exports = router;
