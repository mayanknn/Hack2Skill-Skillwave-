import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { app } from '../../firebase';
import { getFirestore, collection, query, getDocs, where } from 'firebase/firestore';

const auth = getAuth(app);
const db = getFirestore(app);

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const userRef = collection(db, 'users');
  const preferencesRef = collection(db, 'preferences');
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        if (user.Role === 'Learner') {
          navigate('/learner');
        } else if (user.Role === 'Teacher') {
          navigate('/teacher');
        }
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
      }
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert('Login Successful');
  
      const querySnapshot = await getDocs(query(userRef, where('Email', '==', email)));
      if (!querySnapshot.empty) {
        const queryData = querySnapshot.docs[0].data();
        const userId = querySnapshot.docs[0].id;
  
        // Store user data in localStorage
        localStorage.setItem('userData', JSON.stringify(queryData));
  
        // Fetch preferences data
        const prefsQuery = query(preferencesRef, where('userid', '==', userId));
        const prefsSnapshot = await getDocs(prefsQuery);
  
        let preferencesData;
        if (!prefsSnapshot.empty) {
          preferencesData = prefsSnapshot.docs.map(doc => doc.data());
        } else {
          preferencesData = [];
        }
  
        // Store preferences data in localStorage
        localStorage.setItem('preferencesData', JSON.stringify(preferencesData));
        
  
        // Debug logging
        console.log('Preferences Data:', preferencesData);
  
        // Navigate based on user role
        if (queryData.Role === 'Learner') {
          navigate('/learner');
        } else if (queryData.Role === 'Teacher') {
          navigate('/teacher');
        }
      } else {
        alert('No user data found');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      alert('Login failed');
    }
  };
  

  return (
    <div className="login-form">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <p>Don't have an account? <Link to="/register">Register here</Link></p>
    </div>
  );
};

export default LoginForm;
