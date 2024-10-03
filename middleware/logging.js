const fs = require('fs');
const path = require('path');
const morgan = require('morgan');

// Define the logs directory
const logsDir = path.join(__dirname, '../', 'logs');
const logsFilename = 'access.log';
const errorLogFilename = 'error.log';

// Check if the logs directory exists, if not create it
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Create a write stream (in append mode) for logging
const accessLogStream = fs.createWriteStream(path.join(logsDir, logsFilename), { flags: 'a' });

// Setup morgan to log requests to the access.log file
const logger = morgan('combined', { stream: accessLogStream });

// Function to write to error log
const writeToErrorLog = (error) => {
  let errorMessage;
  if (typeof error === 'string') {
    errorMessage = error;
  } else if (error instanceof Error) {
    errorMessage = error.stack || error.message || 'Unknown error';
  } else {
    errorMessage = JSON.stringify(error);
  }
  const logEntry = `${new Date().toISOString()} - Error: ${errorMessage}\n`;
  fs.appendFileSync(path.join(logsDir, errorLogFilename), logEntry);
};

// Middleware function to log errors
const errorLogger = (err, req, res, next) => {
  writeToErrorLog(err);
  next(err); // Pass the error to the next middleware
};

// Export the logger, error logger, and writeToErrorLog function
module.exports = {
  logger,
  errorLogger,
  writeToErrorLog
};
