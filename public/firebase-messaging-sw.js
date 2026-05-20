// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

// Your exact Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDLUQsV2m7VGlOkCDiQ4KlRLJx3FyvRutY",
  authDomain: "thecareer-advisors.firebaseapp.com",
  projectId: "thecareer-advisors",
  storageBucket: "thecareer-advisors.firebasestorage.app",
  messagingSenderId: "803782472900",
  appId: "1:803782472900:web:68d5a25f7b50963e0dc591"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// This runs when the website is closed!
messaging.onBackgroundMessage((payload) => {
  console.log('[Service Worker] Received background message: ', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo.png', // Ensure this exists in your public folder
    badge: '/logo.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});