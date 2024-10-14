const jwt = require('jsonwebtoken');
const { createErrorResponse } = require('../lib/error');

const verifyCSRF = (req, res, next) => {
  const csrfToken = req.headers['x-csrf-token'];
  const secret = process.env.JwtSecureKey; // Replace with your actual shared secret

  if (process.env.NODE_ENV === 'development') return next();

  if (!csrfToken) {
    createErrorResponse(res, 403, "Bad or missing CSRF Token");
    return;
  }

  // Verify the JWT using the HS256 algorithm and the shared secret
  jwt.verify(csrfToken.toString(), secret, { algorithms: ['HS256'] }, (err, decoded) => {
    if (err) {
      createErrorResponse(res, 403, "Invalid or tampered CSRF Token");
      return;
    }

    const ipData = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    // Token is verified, now check expiration and IP match
    const { exp, CSRF } = decoded;  // Cast to any for custom JWT payload fields

    const currentTime = Math.floor(Date.now() / 1000);

    if (exp <= currentTime) {
      createErrorResponse(res, 403, "Security token has expired");
      return;
    }

    if (process.env.NODE_ENV !== 'development' && CSRF !== ipData) {
      createErrorResponse(res, 403, "Bad or missing CSRF Token");
      return;
    }

    next();
  });
};

module.exports = verifyCSRF;