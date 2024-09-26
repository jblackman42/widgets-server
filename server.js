const express = require('express');
const cors = require('cors');
const {rateLimit} = require('express-rate-limit');
const verifyCSRF = require('./middleware/verifyCSRF');

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

app.use('/custom-widgets/Home/CSRFToken', require('./routes/GetCSRFToken'));
app.use('/custom-widgets/api/widgets', verifyCSRF, require('./routes/Widgets'));

const port = process.env.PORT || 5000;
(async () => {
  try {
    app.listen(port, () => console.log(`Server is listening on port ${port} - http://localhost:${port}`));
  } catch (error) { console.log(error) }
})();