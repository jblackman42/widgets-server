const jwt = require('jsonwebtoken');

const verifyCSRF = (req, res, next) => {
  const csrfToken = req.headers['x-csrf-token'];
  const secret = process.env.JwtSecureKey; // Replace with your actual shared secret

  if (!csrfToken) {
    res.status(403).send("Bad or missing CSRF Token");
    return;
  }

  // Verify the JWT using the HS256 algorithm and the shared secret
  jwt.verify(csrfToken.toString(), secret, { algorithms: ['HS256'] }, (err, decoded) => {
    if (err) {
      console.error('Failed to verify JWT:', err);
      res.status(403).send("Invalid or tampered CSRF Token");
      return;
    }

    const ipData = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    // Token is verified, now check expiration and IP match
    const { exp, CSRF } = decoded;  // Cast to any for custom JWT payload fields

    const currentTime = Math.floor(Date.now() / 1000);

    if (exp <= currentTime) {
      res.status(403).send("CSRF Token has expired.");
      return;
    }

    if (process.env.NODE_ENV === 'production' && CSRF !== ipData) {
      res.status(403).send("Invalid CSRF token for your IP.");
      return;
    }

    next();
  });
};

module.exports = verifyCSRF;