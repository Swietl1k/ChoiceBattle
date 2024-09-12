import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {

  apiKey: "AIzaSyDQBNgLiXKCeD9z5Ny-ponP9Czao7hlVTg",

  authDomain: "imageupload-f4352.firebaseapp.com",

  projectId: "imageupload-f4352",

  storageBucket: "imageupload-f4352.appspot.com",

  messagingSenderId: "397551068312",

  appId: "1:397551068312:web:f20cfc6b43c8a0b3eb9ced"

};

const app = initializeApp(firebaseConfig);

export const imageStorage = getStorage(app);