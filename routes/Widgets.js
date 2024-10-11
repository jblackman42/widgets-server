const express = require('express');
const path = require('path');
const fs = require('fs');
const {handleError} = require('../lib/error');
const { writeToErrorLog } = require('../middleware/logging')

const router = express.Router();

router.post('/report-error', async (req, res) => {
  const forwardedFor = req.headers['x-forwarded-for'];
  let ip = forwardedFor ? forwardedFor.split(',')[0].trim() : req.socket.remoteAddress;
  const { Message, Location, Browser, Platform, Language, Cookies, Screen } = req.body;
  const writeMsg = `${Message} ${Location} ${Browser} ${Platform} ${Language} ${Cookies} X:${Screen.Width} Y:${Screen.Height} IP:${ip}`

  writeToErrorLog(writeMsg);
  res.sendStatus(200);
});

router.get('/', async (req, res) => {
  try {
    const metadataPath = path.join(__dirname, '..', 'dist', 'customWidgetsMetadata.json');
    const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
    res.json(metadata);
  } catch (error) {
    handleError(error, req, res, "Unable to retrieve component metadata");
  }
});

module.exports = router;