import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from 'firebase/auth'
import {getFirestore} from 'firebase/firestore'
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyADTvObkBaBKCI8kyOO_IRgIPNMmkkrbxY",
  authDomain: "dh-chat-98b84.firebaseapp.com",
  projectId: "dh-chat-98b84",
  storageBucket: "dh-chat-98b84.appspot.com",
  messagingSenderId: "276081633388",
  appId: "1:276081633388:web:d234626fbd83702841d049",
  measurementId: "G-25CEFKN7SG"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
export const db = getFirestore(app)
export const storage = getStorage(app); 
