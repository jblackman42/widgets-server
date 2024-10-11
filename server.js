const express = require('express');
const cors = require('cors');
const path = require('path');
const {rateLimit} = require('express-rate-limit');
const verifyCSRF = require('./middleware/verifyCSRF');
const { logger, errorLogger } = require('./middleware/logging'); // Ensure the path is correct

const app = express();
require('dotenv').config()

const getLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  limit: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: 'draft-7',
  legacyHeaders: false
});

const postLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  limit: 4, // limit each IP to 4 requests per windowMs
  standardHeaders: 'draft-7',
  legacyHeaders: false
});

// Middleware to apply different rate limits based on request method
function methodBasedRateLimiter(req, res, next) {
  if (req.method === 'GET') {
    return getLimiter(req, res, next);
  } else if (req.method === 'POST') {
    return postLimiter(req, res, next);
  }
  next();
}

// Apply the method-based rate limiter to all routes
app.use(cors());
if (process.env.NODE_ENV === 'production') app.use(logger);
app.use(methodBasedRateLimiter);

// Add body-parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/custom-widgets/Home', require('./routes/GetCSRFToken'));
app.use('/custom-widgets/Widgets', require('./routes/Widgets'));
app.use('/custom-widgets/Api', verifyCSRF, require('./routes/WidgetQueries'));

// Serve static files from the 'dist' directory
app.use('/custom-widgets/dist', express.static(path.join(__dirname, 'dist')));

// Use the error logger middleware after your routes
app.use(errorLogger);

const port = process.env.PORT || 5000;
(async () => {
  try {
    app.listen(port, () => console.log(`Server is listening on port ${port} - http://localhost:${port}`));
  } catch (error) {
    console.error(error);
    writeToErrorLog(error);
  }
})();