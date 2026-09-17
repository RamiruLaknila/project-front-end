import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Values come from .env.local (see .env.example). A Firebase Web API key is not
// a secret -- it ships in the client bundle of every Firebase web app. Access is
// controlled by Firebase Auth settings and by the backend verifying the ID
// token, not by keeping this config hidden.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

if (!firebaseConfig.apiKey || !firebaseConfig.appId) {
  // Fail loudly in dev instead of throwing a cryptic Firebase error later on.
  console.error(
    "[firebase] Missing config. Copy .env.example to .env.local, fill in the " +
      "Firebase Web app values, and restart the dev server."
  );
}

export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
