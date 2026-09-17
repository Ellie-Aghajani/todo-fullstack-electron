import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBzXJIR3bzxOrXZUFlSqBpstadzHj40Czc",
  authDomain: "todo-85812.firebaseapp.com",
  projectId: "todo-85812",
  storageBucket: "todo-85812.firebasestorage.app",
  messagingSenderId: "571295387066",
  appId: "1:571295387066:web:36c8494585bc249b5e6183",
  measurementId: "G-FKSYXGPG3Z",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
