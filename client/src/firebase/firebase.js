import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateEmail,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyCZlDJH6SBKpd7Q4HU0dXXVh9gR0GdJUoM',
  authDomain: 'house-of-books-fc08c.firebaseapp.com',
  projectId: 'house-of-books-fc08c',
  storageBucket: 'house-of-books-fc08c.appspot.com',
  messagingSenderId: '827562959146',
  appId: '1:827562959146:web:0d32bcff164c2e0c76be53',
};

initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: 'select_account',
});

export const auth = getAuth();
export const signInWithGooglePopup = () => signInWithPopup(auth, provider);

export const createNativeUser = async (email, password) => {
  if (!email || !password) return;

  return await createUserWithEmailAndPassword(auth, email, password);
};

export const NativeSignIn = async (email, password) => {
  if (!email || !password) return;

  return await signInWithEmailAndPassword(auth, email, password);
};

export const signOutUser = async () => await signOut(auth);

export const onAuthStateChangedListener = (callback) =>
  onAuthStateChanged(auth, callback);

export const emailUpdate = async (email) => {
  if (!email) return;

  return await updateEmail(auth.currentUser, email);
};
