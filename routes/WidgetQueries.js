const express = require('express');
const {db} = require('../db/database');
const {handleError} = require('../lib/error');
const fs = require('fs');
const path = require('path');

const router = express.Router();


const queriesDir = path.join(__dirname, '..', 'queries');
const files = fs.readdirSync(queriesDir);
const sqlFiles = files.filter(file => path.extname(file).toLowerCase() === '.sql');

sqlFiles.forEach(file => {
  const queryName = path.parse(file).name;
  router.post(`/${queryName}`, async (req, res) => {
    try {
      res.send(await db.queryFromPath(queryName));
    } catch (error) {
      handleError(error, req, res);
    }
  });
});

// router.post('/staff', async (req, res) => {
//   try {
//     res.send(await db.queryFromPath('staff'));
//   } catch (error) {
//     handleError(error, req, res);
//   }
// });

// router.post('/sermons', async (req, res) => {
//   try {
//     res.send(await db.queryFromPath('sermons'));
//   } catch (error) {
//     handleError(error, req, res);
//   }
// });

module.exports = router;