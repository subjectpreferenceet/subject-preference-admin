
import { initializeApp } from "firebase/app";
import {
  getAuth,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { toast } from "react-toastify";

const firebaseConfig = {
  apiKey: "AIzaSyB3QrCpg0FAMM7mYbmnO6MDA39WSekTDpY",
  authDomain: "subject-preference-admin.firebaseapp.com",
  projectId: "subject-preference-admin",
  storageBucket: "subject-preference-admin.firebasestorage.app",
  messagingSenderId: "323301562131",
  appId: "1:323301562131:web:0a1925679dd077c4afece6"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const login = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    toast.success("Admin Logged in Successfully!");
  } catch (error) {
    console.error("Login Error:", error);
    toast.error(error.message);
  }
};

const logout = async () => {
  try {
    await signOut(auth);
    toast.success("Logged out successfully!");
  } catch (error) {
    console.error("Logout Error:", error);
    toast.error(error.message);
  }
};

const resetPass = async (email) => {
    if (!email) {
      toast.error("Enter Email In the Email Field");
      return null;
    }
  
    try {
      await sendPasswordResetEmail(auth, email);
      toast.info("Password reset email sent!");
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    }
  };

export { login, logout, auth,resetPass };


