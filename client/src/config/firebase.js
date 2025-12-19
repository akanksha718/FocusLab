
import { initializeApp } from "firebase/app";
import { getAuth,GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAYZ77FDO5nQ-XGapuvHYsYhDrN5yvHsFs",
    authDomain: "focuslab-90a57.firebaseapp.com",
    projectId: "focuslab-90a57",
    appId: "1:1005613284290:web:e0c0ed3e5e5d036e99745b",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);