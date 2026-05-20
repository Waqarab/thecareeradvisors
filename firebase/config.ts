import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// ADD THESE IMPORTS:
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// 1. Initialize core Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

// 2. Initialize App Check (ONLY on the client side!)
if (typeof window !== "undefined") {
  
  // This allows you to test on localhost without Firebase blocking you
  if (process.env.NODE_ENV === 'development') {
    (self as any).FIREBASE_APPCHECK_DEBUG_TOKEN = true;
  }

  // Activate the shield
  initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY as string),
    isTokenAutoRefreshEnabled: true // Refreshes the security token silently in the background
  });
}

export { app, db };