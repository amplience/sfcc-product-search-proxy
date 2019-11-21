const request = require('request');
const _ = require('lodash');
const getToken = require('./get-token');

async function productSearch(req, res) {
  try {
    const token = await getToken(req);
    if (!token) {
      return;
    }
    const {site_id, search_text, catalog_id, endpoint, page} = req.body;
    const PAGE_SIZE = 20;
    const start = PAGE_SIZE * page;

    request.post({
      //@TODO: needs to be removed or configurable via env var for testing
      rejectUnauthorized: false,
      url: _.trimEnd(endpoint, '/') + '/s/-/dw/data/v19_10/product_search',
      qs: {site_id},
      headers: {
        Authorization: 'Bearer ' + token
      },
      json: {
        query : {
          bool_query: {
            must: [
              {text_query: {fields: ['id','name'],search_phrase: search_text}},
              {term_query: {fields: ['catalog_id'], operator: 'is', values: []}},
            ]
          }
        },
        start,
        count: PAGE_SIZE,
        // @TODO: expand does not seem to work
        expand: ['all_images'],
        select : '(**)'
      }
    },
    (err, response, body) => {
      if (response.statusCode !== 200) {
        res.status(500).json({code: 'PRODUCT_SEARCH_ERROR', message: 'Error searching for products'});
        console.log(err);
        return;
      }
      const {hits, total} = body;
      let items = [];
      const numPages = Math.ceil(total / PAGE_SIZE);
      const pageSettings = {numPages, curPage: page.curPage, total};
      console.log(body);
      if (hits) {
        items = hits.map(hit => ({
          id: hit.id, 
          name: hit.name.default,
          //@TODO: can't get images to return
          // image: hit.image.link
          image: 'https://placekitten.com/400/400'
        }));
      }

      res.status(200).json({items, page: pageSettings});
    });
  } catch (error) {
    console.log('An unkown error occured', error);
    res.status(500).json({code: 'UNKNOWN', message: 'An unknown error occured'});
  }
  
}

module.exports = productSearch;