// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyAiFwmWbNvofxcF19YPgoYxm34ZWwn0tPs",
    authDomain: "qiaoqiao-d30c6.firebaseapp.com",
    projectId: "qiaoqiao-d30c6",
    storageBucket: "qiaoqiao-d30c6.appspot.com",
    messagingSenderId: "705911125315",
    appId: "1:705911125315:web:912c331d722eee0debebf6",
    measurementId: "G-DGKGPLW50R"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app)