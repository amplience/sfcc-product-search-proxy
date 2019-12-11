const getProducts = require('./get-products');

async function products(req, res) {
  const {ids} = req.query;
  const query = {
    term_query: {
      fields: ['id'],
      operator: 'one_of',
      values: ids
    }
  };
  const PAGE_SIZE = 100;
  await getProducts(req, res, query, req.query, PAGE_SIZE);
}

module.exports = products;
