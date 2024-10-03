const express = require('express');
const {db} = require('../db/database');
const {handleError} = require('../util/error');

const router = express.Router();

router.post('/staff', async (req, res) => {
  try {
    res.send(await db.queryFromPath('staff'));
  } catch (error) {
    handleError(error, req, res);
  }
});

router.post('/sermons', async (req, res) => {
  try {
    res.send(await db.queryFromPath('sermons'));
  } catch (error) {
    handleError(error, req, res);
  }
});

module.exports = router;