import { initializeApp } from "firebase/app";
import { getDatabase, ref, push } from "firebase/database";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

if (!firebaseConfig.databaseURL) {
  console.warn(
    "Firebase config missing. Set REACT_APP_FIREBASE_DATABASE_URL in .env"
  );
}

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

/**
 * sendComplaint
 * - stores complaint in Realtime Database under /complaints
 * - returns pushed key
 */
export async function sendComplaint({ name, email, subject, message }) {
  const complaintsRef = ref(db, "complaints");
  const snapshotRef = await push(complaintsRef, {
    name: name || "Anonymous",
    email: email || "",
    subject: subject || "",
    message: message || "",
    createdAt: Date.now(),
  });
  return snapshotRef.key;
}

/**
 * optional: callCloudFunction
 * If you deploy a Cloud Function to actually send an email to your inbox,
 * set REACT_APP_CONTACT_CLOUD_FN to its URL. The function should accept JSON { name, email, subject, message }.
 */
export async function callCloudFunction(payload) {
  const url = import.meta.env.VITE_CONTACT_CLOUD_FN;
  if (!url) return null;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Cloud function error");
  return res.json();
}
