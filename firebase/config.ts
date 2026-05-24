import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
/*import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";*/

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

// 2. Initialize App Check (ONLY on client side AND ONLY in Production)
if (typeof window !== "undefined") {
  
  // Hard kill-switch: If we are on localhost, DO NOT run App Check.
  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    try {
      /*initializeAppCheck(app, {
        provider: new ReCaptchaV3Provider(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY as string),
        isTokenAutoRefreshEnabled: true 
      });*/
    } catch (e) {
      console.warn("App Check initialization error:", e);
    }
  } else {
    console.log("Local development detected: Firebase App Check completely bypassed.");
  }
}

export { app, db };