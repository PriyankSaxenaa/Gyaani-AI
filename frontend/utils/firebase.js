// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "gyaani-ai-fe96f.firebaseapp.com",
  projectId: "gyaani-ai-fe96f",
  storageBucket: "gyaani-ai-fe96f.firebasestorage.app",
  messagingSenderId: "561832529011",
  appId: "1:561832529011:web:cc301c243a76b087f3ae06"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const auth=getAuth(app)
export const googleProvider=new GoogleAuthProvider()