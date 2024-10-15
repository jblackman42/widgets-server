const jwksRsa = require('jwks-rsa');

let oauthConfig = null;
let jwksClient = null;

async function initializeOAuth() {
  if (oauthConfig) return oauthConfig;

  try {
    const response = await fetch(process.env.OAUTH_DISCOVERY_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    oauthConfig = await response.json();
    jwksClient = jwksRsa({
      jwksUri: oauthConfig.jwks_uri
    });
    return oauthConfig;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('Failed to fetch OAuth configuration:', error);
    throw new Error('Unable to retrieve OAuth configuration');
  }
}

function getJwksClient() {
  if (!jwksClient) {
    throw new Error('JWKS client not initialized');
  }
  return jwksClient;
}

module.exports = { initializeOAuth, getJwksClient };
