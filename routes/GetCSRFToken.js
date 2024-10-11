const express = require('express');
const jwt = require('jsonwebtoken');
const net = require('net');
const { handleError } = require('../lib/error');

function isValidIP(ip) {
  return net.isIP(ip) !== 0;
}

const router = express.Router();

router.get('/CSRFToken', async (req, res) => {
  try {
    const forwardedFor = req.headers['x-forwarded-for'];
    let ip = forwardedFor ? forwardedFor.split(',')[0].trim() : req.socket.remoteAddress;
    
    if (!isValidIP(ip)) {
      ip = '0.0.0.0'; // fallback to a default IP if invalid
    }
    
    // GENERATE CSRF TOKEN PAYLOAD
    const payload = {
      CSRF: ip
    };
    const expiresInMinutes = 30;

    if (!process.env.JwtSecureKey) {
      handleError("JwtSecureKey environment variable is not set", req, res);
      return;
    }

    const token = jwt.sign(payload, process.env.JwtSecureKey, {
      algorithm: 'HS256',
      expiresIn: `${expiresInMinutes}m`,
      notBefore: '0s',
      issuer: 'ministryplatform.com',
      audience: ''
    });
  
    // Calculate expiry date in UTC
    const expiresAfterUtc = new Date(Date.now() + expiresInMinutes * 60 * 1000).toISOString();
  
    res.json({ token, expiresAfterUtc });
  } catch (error) {
    handleError(error, req, res);
  }
});

module.exports = router;