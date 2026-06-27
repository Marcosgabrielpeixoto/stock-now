import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBSuqqjAMcm--_kvEApMkEFqBFQAN2BBgM",
  authDomain: "stock-now-111c3.firebaseapp.com",
  projectId: "stock-now-111c3",
  storageBucket: "stock-now-111c3.firebasestorage.app",
  messagingSenderId: "958105700776",
  appId: "1:958105700776:web:aaad9d29744bccdbe9359d"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
