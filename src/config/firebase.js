import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBxJeulZe5SuPztPu56KVuDMSJchONb5OA",
  authDomain: "flic-69356.firebaseapp.com",
  projectId: "flic-69356",
  storageBucket: "flic-69356.firebasestorage.app",
  messagingSenderId: "115873070240",
  appId: "1:115873070240:web:b37f21f1e4f64539299dc5"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); 