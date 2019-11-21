const request = require('request');
const _ = require('lodash');
const getToken = require('./get-token');

async function products(req, res) {
  const token = await getToken(req);
  if (!token) {
    return;
  }
  const {ids, endpoint, site_id} = req.body;
  try {
    request.get({
      url: _.trimEnd(endpoint, '/') + '/s/-/dw/data/v19_10/products/' + ids.join(','),
      headers: {
        Authorization: 'Bearer ' + token
      },
      qs: {expand: 'images', site_id}
    });
  } catch (e) {}
}

module.exports = products;