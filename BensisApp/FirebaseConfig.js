import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "Your-API-Key",
  authDomain: "bensisdb.firebaseapp.com",
  databaseURL: "https://bensisdb-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "bensisdb",
  storageBucket: "bensisdb.appspot.com",
  messagingSenderId: "Your-Sender-ID",
  appId: "Your-App-ID"
};

const app = initializeApp(firebaseConfig);

export default app;
