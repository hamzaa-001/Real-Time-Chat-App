import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC2YZ-jaigVMTG2RfYt3YF1zGsj8TeKMC8",
  authDomain: "chat-app-1-be872.firebaseapp.com",
  projectId: "chat-app-1-be872",
  storageBucket: "chat-app-1-be872.appspot.com",
  messagingSenderId: "749404623778",
  appId: "1:749404623778:web:579170a4694e494e1118fb",
  measurementId: "G-W28DD41XT1",
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth(app);

export { app, firestore, auth };
