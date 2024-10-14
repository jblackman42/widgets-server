const dotenv = require('dotenv');

// Load environment variables from .env file
const env = dotenv.config().parsed;

// Manually define environment variables
const envKeys = {
  'process.env.BASE_URL': JSON.stringify(env.BASE_URL),
  'process.env.PLATFORM_URL': JSON.stringify(env.PLATFORM_URL),
  'process.env.SESSION_STORAGE_PREFIX': JSON.stringify(env.SESSION_STORAGE_PREFIX),
};

module.exports = envKeys;