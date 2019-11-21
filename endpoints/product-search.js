var getToken = require('./get-token');

var headers = {'Content-Type': 'application/json'}; 

async function productSearch(req, res) {
  // res.status(200).header('Content-Type', 'application/json').send(JSON.stringify({test: true}));
  try {
    var token = await getToken(req, res);
    console.log(token);
    if (token) {
      res.status(200).header('Content-Type', 'application/json').send(JSON.stringify({token}));
    }
  } catch (e) {
    res.status(500).header('Content-Type', 'application/json').send(JSON.stringify({code: 'TOKEN_ERROR', message: 'Error getting token'}));
  }
  
}

module.exports = productSearch;