const getProducts = require('./get-products');

function products(req, res) {
  const {ids} = req.body;
  const query = {
    bool_query: {
      should: ids.map(search_phrase => ({text_query: {fields: ['id'], search_phrase}}))
    }
  }
  return getProducts(req, res, query);
}

module.exports = products;