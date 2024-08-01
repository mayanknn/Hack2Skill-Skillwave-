import { initializeApp } from "firebase/app"; 

const firebaseConfig = { 
  apiKey: "AIzaSyBnJzOESxvHUgo_thvfW2OXpYsaW43OdDM", 
  authDomain: "skillwave-43d96.firebaseapp.com", 
  projectId: "skillwave-43d96", 
  storageBucket: "skillwave-43d96.appspot.com", 
  messagingSenderId: "761044551750", 
  appId: "1:761044551750:web:f5f1fbfce13af52bc6a247", 
  measurementId: "G-PJWX5RD8LK" 
}; 
 
// Initialize Firebase 
export const app = initializeApp(firebaseConfig); 