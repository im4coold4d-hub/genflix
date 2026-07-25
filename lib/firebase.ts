import { initializeApp, getApps } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDRHciDRjPMdERvPJi_GkXCgHWKT-N_3m4",
  authDomain: "studio-7832018430-71d0c.firebaseapp.com",
  databaseURL: "https://studio-7832018430-71d0c-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "studio-7832018430-71d0c",
  storageBucket: "studio-7832018430-71d0c.firebasestorage.app",
  messagingSenderId: "143321458043",
  appId: "1:143321458043:web:58f9673cb4b03d97e7c9de"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getDatabase(app);
export const auth = getAuth(app);