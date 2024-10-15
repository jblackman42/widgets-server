const express = require('express');
const { db } = require('../db/database');
const { createErrorResponse, handleError } = require('../lib/error');
const { authMiddleware } = require('../middleware/auth');
const fs = require('fs');
const path = require('path');

const router = express.Router();

const queriesDir = path.join(__dirname, '..', 'queries');
const files = fs.readdirSync(queriesDir);
const sqlFiles = files.filter(file => path.extname(file).toLowerCase() === '.sql');

sqlFiles.forEach(file => {
  const queryName = path.parse(file).name;
  const requiresAuth = queryName.startsWith('auth_');
  const routeName = requiresAuth ? queryName.slice(5) : queryName;

  const routeHandler = async (req, res) => {
    try {
      if (requiresAuth) {
        res.send(await db.queryFromPath(queryName, req.user));
      } else {
        res.send(await db.queryFromPath(queryName));
      }
    } catch (error) {
      handleError(error, req, res, error.message);
    }
  };

  if (requiresAuth) {
    router.post(`/${routeName}`, authMiddleware, routeHandler);
  } else {
    router.post(`/${routeName}`, routeHandler);
  }
});

module.exports = router;
