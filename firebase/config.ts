import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAppCheck, ReCaptchaV3Provider, getToken, type AppCheck } from "firebase/app-check";

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

let appCheckInstance: AppCheck | null = null;

// 2. Initialize App Check (ONLY on client side AND ONLY in Production)
if (typeof window !== "undefined") {
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const hasDebugToken = !!process.env.NEXT_PUBLIC_FIREBASE_APPCHECK_DEBUG_TOKEN;

  if (!isLocalhost || hasDebugToken) {
    try {
      if (!process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) {
        console.warn("NEXT_PUBLIC_RECAPTCHA_SITE_KEY is not defined");
      }
      
      if (isLocalhost && hasDebugToken) {
        (self as any).FIREBASE_APPCHECK_DEBUG_TOKEN =
          process.env.NEXT_PUBLIC_FIREBASE_APPCHECK_DEBUG_TOKEN === "true"
            ? true
            : process.env.NEXT_PUBLIC_FIREBASE_APPCHECK_DEBUG_TOKEN;
      }

      appCheckInstance = initializeAppCheck(app, {
        provider: new ReCaptchaV3Provider(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY as string),
        isTokenAutoRefreshEnabled: true 
      });
    } catch (e) {
      console.warn("App Check initialization error:", e);
    }
  } else {
    console.log("Local development detected: Firebase App Check completely bypassed.");
  }
}

export async function getAppCheckToken(): Promise<string | null> {
  try {
    if (!appCheckInstance) return null;
    const result = await getToken(appCheckInstance, false); // false = use cached if available
    return result.token;
  } catch (err) {
    console.warn("[AppCheck] Token fetch failed:", err);
    return null;
  }
}

export { app, db, appCheckInstance };