const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.get('/', (req, res) => {
  // GENERATE CSRF TOKEN PAYLOAD
  const ipData = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const payload = {
    CSRF: ipData
  };
  const token = jwt.sign(payload, process.env.JwtSecureKey, {
    algorithm: 'HS256',
    expiresIn: '30m',
    notBefore: '0s',
    issuer: 'ministryplatform.com',
    audience: ''
  })
  res.send(token);
});

module.exports = router;