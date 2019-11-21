var getToken = require('./get-token');

async function productSearch(req, res) {
  const response = res.header('Content-Type', 'application/json');
  try {
    var token = await getToken(req, res);
    console.log(token);
    if (token) {
      response.status(200).send(JSON.stringify({token}));
    }
  } catch (code) {
    if (code === 'MISSING_KEY_SECRET') {
      res.status(400)
        .send(JSON.stringify({code, message: 'authId and authSecret headers must be supplied.'}));
    } else if (code=== 'TOKEN_ERROR') {
        res.status(500).send(JSON.stringify({code, message: 'Error getting token'}));
    } else {
      res.status(500).send(JSON.stringify({code: 'UNKNOWN', message: 'An unknown error occured'}));
    }
  }
  
}

module.exports = productSearch;