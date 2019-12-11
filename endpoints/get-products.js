const request = require('request');
const _ = require('lodash');
const getToken = require('./get-token');
const config = require('../config');
const logger = require("../resources/logging/debug-logger").getLogger();

async function getProducts(req, res, query, params, tokenSupplier, PAGE_SIZE = 20) {
  return new Promise(async (resolve) => {
    let token;
  try {
     token = await tokenSupplier(req, res);
    if (!token) {
      return resolve();
    }
  }catch (e) {
    return resolve();
  }

  try {
    const {site_id, endpoint, page = 0} = params;
    const start = PAGE_SIZE * page;
    const rejectUnauthorized = !config.isDev;
    logger.info(site_id, endpoint, page);
    await request.post({
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
   async (err, response, body) => {
      console.log(`got response ${response.statusCode}`)
      if (err || response.statusCode !== 200) {
        res.status(500).json({code: 'PRODUCT_SEARCH_ERROR', message: 'Error searching for products'});
        logger.error('none 200 response from sfcc get products.', err);
        return resolve();
      }
      const {hits, total} = body;
      let items = [];
      const numPages = Math.ceil(total / PAGE_SIZE);
      const pageSettings = {numPages, curPage: page, total};

      if (hits) {
        console.log(`fuck yeah ${JSON.stringify(hits)}`);
        hits.forEach(x => {
          console.log(`bout to `)
          console.log(_.get(x, 'image.abs_url', null))
          console.log(`done  brash `)
        });

        console.log('here it is boi');

        items = hits.map(hit => ({
          id: hit.id,
          name: (hit.name && hit.name.default) ? hit.name.default : null,
          image: _.get(hit, 'image.abs_url', null)
        }));
      }

      res.status(200).json({items, page: pageSettings});
      return resolve()
    });
    console.log(`#triggered`)
  } catch (error) {
    logger.error('An unkown error occured', error);
    res.status(500).json({code: 'UNKNOWN', message: 'An unknown error occured'});
    return resolve();
  }
  });
  console.log('done sone ')
}

module.exports = getProducts;
