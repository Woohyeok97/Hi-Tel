// Firsebase SDK들
import { FirebaseApp, getApp, initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
import 'firebase/auth'

export let app : FirebaseApp;

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_ID,
};

try {
    app = getApp('app');
} catch {
    app = initializeApp(firebaseConfig, 'app'); // Firsebase 앱 초기화
}


const firebase = initializeApp(firebaseConfig); // Firsebase 앱 초기화

// 파이어스토어 (DB) 인스턴스 생성
export const db = getFirestore(app)

export default firebase;