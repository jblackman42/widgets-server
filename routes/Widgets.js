const express = require('express');
const {db} = require('../db/database');

const router = express.Router();

router.get('/staff', async (req, res) => {
  try {
    const result = await db.queryFromPath('staff');
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send('Query execution failed');
  }
});

module.exports = router;