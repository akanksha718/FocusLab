import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail
} from "firebase/auth";
import axios from "axios";
import { auth } from "../config/firebase";

const API = import.meta.env.VITE_API || "http://localhost:3000";

export const emailSignup = async (email, password) => {
  const userCred = await createUserWithEmailAndPassword(auth, email, password);
  await sendEmailVerification(userCred.user);
  alert("Verify your email before login");
};

export const emailLogin = async (email, password) => {
  const userCred = await signInWithEmailAndPassword(auth, email, password);

  if (!userCred.user.emailVerified) {
    throw new Error("Email not verified");
  }

  await syncUser(userCred.user);
};

export const googleAuth = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  await syncUser(result.user);
};

export const resetPassword = async (email) => {
  await sendPasswordResetEmail(auth, email);
  alert("Password reset email sent");
};

const syncUser = async (user) => {
  const token = await user.getIdToken();

  await axios.post(`${API}/auth/data`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
};





