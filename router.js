const express = require('express');
const router = express.Router();
const validate = require('express-validation');
const validation = require('./validation');

const productSearch = require('./endpoints/product-search');
const products = require('./endpoints/products');

router.post('/product-search', validate(validation.productSearch), new productSearch().search);
router.get('/products', validate(validation.products), new products().find);

router.use((err, req, res, next)=>{
  if (err instanceof validate.ValidationError) {
  res.status(err.status).json(err);
  } else {
  res.send(err);
  }
});

module.exports = router;
