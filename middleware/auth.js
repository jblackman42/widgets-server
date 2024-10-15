const jwt = require('jsonwebtoken');
const { getJwksClient } = require('../lib/oauthConfig');
const { createErrorResponse } = require('../lib/error');

function getKey(header, callback) {
  const client = getJwksClient();
  client.getSigningKey(header.kid, function(err, key) {
    if (err) {
      callback(err);
    } else {
      const signingKey = key.publicKey || key.rsaPublicKey;
      callback(null, signingKey);
    }
  });
}

async function parseAccessToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, getKey, { algorithms: ['RS256'] }, (err, decoded) => {
      if (err) {
        if (process.env.NODE_ENV === 'development') console.error('Token validation failed:', err.message);
        reject(new Error("Error decoding jwt"));
      } else {
        resolve(decoded);
      }
    });
  });
}

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return createErrorResponse(res, 401, "Error decoding jwt");
  }

  const token = authHeader.split(' ')[1];
  parseAccessToken(token)
    .then(decodedToken => {
      req.user = {
        username: decodedToken.name,
        userGUID: decodedToken.sub
      };
      next();
    })
    .catch(error => {
      createErrorResponse(res, 401, error.message);
    });
}

module.exports = { authMiddleware };
