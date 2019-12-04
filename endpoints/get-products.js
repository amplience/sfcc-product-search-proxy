const request = require('request');
const _ = require('lodash');
const getToken = require('./get-token');
const config = require('../config');

async function getProducts(req, res, query, params, PAGE_SIZE = 20) {
  try {
    const token = await getToken(req);
    if (!token) {
      return;
    }
    const {site_id, endpoint, page = 0} = params;
    const start = PAGE_SIZE * page;
    const rejectUnauthorized = !config.isDev;
console.log(site_id, endpoint, page);
    request.post({
      rejectUnauthorized,
      url: _.trimEnd(endpoint, '/') + config.apiPath + '/product_search',
      qs: {site_id},
      headers: {
        Authorization: 'Bearer ' + token
      },
      json: {
        query,
        start,
        count: PAGE_SIZE,
        expand: ['images'],
        select : '(**)'
      }
    },
    (err, response, body) => {
      if (err || response.statusCode !== 200) {
        res.status(500).json({code: 'PRODUCT_SEARCH_ERROR', message: 'Error searching for products'});
        console.log(err);
        return;
      }
      const {hits, total} = body;
      let items = [];
      const numPages = Math.ceil(total / PAGE_SIZE);
      const pageSettings = {numPages, curPage: page, total};

      if (hits) {
        items = hits.map(hit => ({
          id: hit.id,
          name: (hit.name && hit.name.default) ? hit.name.default : null,
          image: _.get(hit, 'image.abs_url', null)
        }));
      }

      res.status(200).json({items, page: pageSettings});
    });
  } catch (error) {
    console.log('An unkown error occured', error);
    res.status(500).json({code: 'UNKNOWN', message: 'An unknown error occured'});
  }

}

module.exports = getProducts;
