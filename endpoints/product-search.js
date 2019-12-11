const getProducts = require('./get-products');

class productSearch {
  constructor(tokenSupplier) {
    this.tokenSupplier = tokenSupplier
  }

  async search(req, res) {
    const {search_text, catalog_id} = req.body;
    const query = {
      bool_query: {
        must: [
          {text_query: {fields: ['id', 'name'], search_phrase: search_text}},
          {term_query: {fields: ['catalog_id'], operator: 'is', values: catalog_id ? [catalog_id] : []}}
        ]
      }
    };
    await getProducts(req, res, query, req.body, this.tokenSupplier);
  }
}

module.exports = productSearch;
