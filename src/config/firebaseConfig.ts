export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCNiLMSOt9xfaXJaWxPylh9WI0nimp9cKM",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "akm-lucky-draw.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "akm-lucky-draw",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "akm-lucky-draw.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1042486665116",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1042486665116:web:7a7171fe0ee8ba60997259"
};
