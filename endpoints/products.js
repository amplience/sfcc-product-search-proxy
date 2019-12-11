const getProducts = require('./get-products');

class products {
  constructor(tokenSupplier) {
    this.tokenSupplier = tokenSupplier
  }

  async find(req, res) {
    const {ids} = req.query;
    const query = {
      term_query: {
        fields: ['id'],
        operator: 'one_of',
        values: ids
      }
    };
    const PAGE_SIZE = 100;
    await getProducts(req, res, query, req.query, PAGE_SIZE, this.tokenSupplier);
  }
}

module.exports = products;
