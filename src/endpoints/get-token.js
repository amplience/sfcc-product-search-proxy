const request = require('request');
const btoa = require('btoa');

const tokens = {};
const ONE_MINUTE = 60000;
const logger = require("../logging/debug-logger").getLogger();

// Remove expired tokens
setInterval(() => {
  Object.getOwnPropertyNames(tokens).map(key => {
    if (tokenExpired(tokens[key].expires)) {
      delete tokens[key];
    }
  });
}, ONE_MINUTE);

function tokenExpired(expires) {
  const FIVE_MINS = 300000;
  const expired = new Date().getTime() + FIVE_MINS;
  return expired > expires;
}

async function getToken(req, res) {
  const authUrl = "https://account.demandware.com/dwsso/oauth2/access_token";
  const authId = req.headers['x-auth-id'];
  const authSecret = req.headers['x-auth-secret'];
  const authToken = btoa(authId + ':' + authSecret);

  return new Promise((resolve, reject) => {
    const existingToken = tokens[authToken];
    if (existingToken && !tokenExpired(existingToken.expires)) {
      return resolve(existingToken.token);
    }

    try {
      request.post({
            url: authUrl,
            headers: {
              Authorization: 'Basic ' + authToken,
            },
            form: {grant_type: 'client_credentials'}
          },
          (err, response, body) => {
            if (err || response.statusCode !== 200) {
              logger.error('Error fetching token', err, (response.statusMessage) ? response.statusMessage : 'unknown');
              res.status(500).json({code: 'TOKEN_ERROR', message: 'Error getting token'});
              return reject(false);
            }
            const token = JSON.parse(body);
            const ONE_SECOND_IN_MILLISECONDS = 1000;
            tokens[authToken] = {
              token: token.access_token,
              expires: new Date().getTime() + (token.expires_in * ONE_SECOND_IN_MILLISECONDS)
            };
            return resolve(token.access_token);
          });
    } catch (e) {
      res.status(500).json({code: 'TOKEN_ERROR', message: 'Error getting token'});
      return reject(false);
    }
  });
}

module.exports = getToken;
