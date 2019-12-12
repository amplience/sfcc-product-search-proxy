const joi = require('joi');

const headers = {
  'x-auth-id': joi.string().required(), 
  'x-auth-secret': joi.string().required(),
  'content-type': joi.string().equal('application/json').required(),
  endpoint: joi.string().uri().trim().required(),
};

module.exports = {

  productSearch: {
    headers,
    body: {
      site_id: joi.string().trim().required(),
      search_text: joi.string().min(3).trim().required(),
      catalog_id: joi.string().trim().optional(),
      page: joi.number().integer().required()
    }
  },
  products: {
    headers,
    query: {
      ids: joi.array().items(joi.string()).required(),
      site_id: joi.string().trim().required()
    }
  }
}