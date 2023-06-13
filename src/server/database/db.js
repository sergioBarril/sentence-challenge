import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

import serviceAccount from "./config.js";

initializeApp({
  credential: cert(serviceAccount),
});

export default getFirestore();
