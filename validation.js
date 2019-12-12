const joi = require('joi');

module.exports = {
  productSearch: {
    body: {
      site_id: joi.string().trim().required(),
      search_text: joi.string().trim().required(),
      endpoint: joi.string().uri().trim().required(),
      catalog_id: joi.string().trim().optional(),
      page: joi.number().integer().required()
    }
  },
  products: {
    query: {
      endpoint: joi.string().uri().trim().required(),
      ids: joi.array().items(joi.string()).required(),
      site_id: joi.string().trim().required()
    }
  }
}