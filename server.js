const express = require('express');
const cors = require('cors');
const path = require('path');
const {rateLimit} = require('express-rate-limit');
const verifyCSRF = require('./middleware/verifyCSRF');
const { logger, errorLogger } = require('./middleware/logging'); // Ensure the path is correct

const app = express();
require('dotenv').config()

const limiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-7',
  legacyHeaders: false
});

app.use(cors());
app.use(limiter);
app.use(logger);

app.use('/custom-widgets/Home', require('./routes/GetCSRFToken'));
app.use('/custom-widgets/Api/', verifyCSRF, require('./routes/Widgets'));

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