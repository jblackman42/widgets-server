const express = require('express');
const {db} = require('../db/database');
const {createErrorResponse} = require('../util/error');

const router = express.Router();

router.post('/staff', async (req, res) => {
  try {
    const result = await db.queryFromPath('staff');
    res.send(result);
  } catch (error) {
    createErrorResponse(res, 500, "Internal Server Error");
  }
});

module.exports = router;