import { initializeApp, getApp, getApps } from "firebase/app";
// import { getFirestore } from "firebase/firestore"
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";

let app;

const firebaseConfig = {
  //demo details
  // apiKey: "AIzaSyC2XPYnn-IdEy1uGR_GRUort17gophJsEM",
  // authDomain: "beautibee-d2eca.firebaseapp.com",
  // projectId: "beautibee-d2eca",
  // storageBucket: "beautibee-d2eca.appspot.com",
  // messagingSenderId: "648825710344",
  // appId: "1:648825710344:web:9405d33e966d2dae2d2ebd",

 // client details
  apiKey: "AIzaSyBJfWnPSKcKQG43jwPwGbQHJ8wLuw-cmMI",
  authDomain: "beautibeeservices.firebaseapp.com",
  projectId: "beautibeeservices",
  storageBucket: "beautibeeservices.appspot.com",
  messagingSenderId: "73910220983",
  appId: "1:73910220983:web:ecdb40252073eed0bf7532",

};

if (getApps().length > 0) {
  app = getApp();
} else {
  app = initializeApp(firebaseConfig);
}

export const db = getFirestore(app);

export const database = getDatabase(app);

export default app;
