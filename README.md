# sentence-challenge

## Set up
To start it, do `npm install` to download the required node_modules.
To run the app, use the command `npm start`.

This App uses several environment variables, that need to be placed in order to run.
- **Firestore credentials**: You need to have a **Firebase project** to run this app. Once it is done, go to: `your project > Project Settings > Service Accounts > Generate new private key`. This will give you a .json file with the credentials. The environment variables are:
  - TYPE
  - PROJECT_ID
  - PRIVATE_KEY_ID
  - CLIENT_EMAIL
  - CLIENT_ID
  - AUTH_URI
  - TOKEN_URI
  - AUTH_PROVIDER_X509_CERT_URL
  - CLIENT_X509_CERT_URL
  - UNIVERSE_DOMAIN
- **DeepL API Key**: In order to use the translation feature, you'll need access to the free API of DeepL. Once you have it, you just have to put it in its environment variable:
  - DEEPL_API_KEY
- In case you want to run the tests, you'll need a second Firebase project where the tests will be targeted. The environment variables used are the same as before, but with `TEST_` at the beginning. So: `TEST_TYPE`, `TEST_PROJECT_ID`, etc.
