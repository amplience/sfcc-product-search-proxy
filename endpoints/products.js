const getProducts = require('./get-products');

function products(req, res) {
  const {ids} = req.body;
  const query = {
    bool_query: {
      should: ids.map(search_phrase => ({text_query: {fields: ['id'], search_phrase}}))
    }
  }
  const PAGE_SIZE = 100;
  return getProducts(req, res, query, PAGE_SIZE);
}

module.exports = products;