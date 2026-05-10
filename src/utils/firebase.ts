import { initializeApp } from "firebase/app";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  sendSignInLinkToEmail,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// ── Google Sign-In (Firebase Popup) ─────────────────────────────────────────
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope("email");
googleProvider.addScope("profile");

export const signInWithGoogle = async () => {
  const result = await signInWithPopup(auth, googleProvider);
  const idToken = await result.user.getIdToken();
  return { idToken, user: result.user };
};

// ── GitHub Sign-In (Firebase Popup) ─────────────────────────────────────────
const githubProvider = new GithubAuthProvider();

export const signInWithGithub = async () => {
  const result = await signInWithPopup(auth, githubProvider);
  const idToken = await result.user.getIdToken();
  return { idToken, user: result.user };
};

// ── Phone OTP ────────────────────────────────────────────────────────────────
export const setupRecaptcha = (containerId: string) => {
  return new RecaptchaVerifier(auth, containerId, {
    size: "invisible",
    callback: () => {},
  });
};

export const requestPhoneOtp = async (
  phoneNumber: string,
  appVerifier: RecaptchaVerifier
) => {
  const confirmationResult = await signInWithPhoneNumber(
    auth,
    phoneNumber,
    appVerifier
  );
  return confirmationResult;
};

// ── Email Link (magic link) ──────────────────────────────────────────────────
export const sendEmailLink = async (email: string) => {
  const actionCodeSettings = {
    url: window.location.origin + "/verify-email",
    handleCodeInApp: true,
  };
  await sendSignInLinkToEmail(auth, email, actionCodeSettings);
  window.localStorage.setItem("emailForSignIn", email);
};
