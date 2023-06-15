import "dotenv/config.js";

const serviceAccount = {
  type: process.env.TEST_TYPE,
  project_id: process.env.TEST_PROJECT_ID,
  private_key_id: process.env.TEST_PRIVATE_KEY_ID,
  private_key: process.env.TEST_PRIVATE_KEY.replace(/\\n/g, "\n"),
  client_email: process.env.TEST_CLIENT_EMAIL,
  client_id: process.env.TEST_CLIENT_ID,
  auth_uri: process.env.TEST_AUTH_URI,
  token_uri: process.env.TEST_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.TEST_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.TEST_CLIENT_X509_CERT_URL,
  universe_domain: process.env.TEST_UNIVERSE_DOMAIN,
};

export default serviceAccount;
