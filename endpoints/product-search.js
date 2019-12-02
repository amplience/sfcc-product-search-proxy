const getProducts = require('./get-products');

function productSearch(req, res) {
  const {search_text, catalog_id} = req.body;
  const query = {
    bool_query: {
      must: [
        {text_query: {fields: ['id','name'],search_phrase: search_text}},
        {term_query: {fields: ['catalog_id'], operator: 'is', values: catalog_id ? [catalog_id] : []}}
      ]
    }
  };
  return getProducts(req, res, query);
}

module.exports = productSearch;