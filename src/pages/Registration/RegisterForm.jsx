// src/components/RegisterForm/RegisterForm.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { collection, getFirestore, setDoc, doc } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL, uploadBytes } from 'firebase/storage';
import { app } from '../../firebase';
// import './RegisterForm.css';

const db = getFirestore(app);
const auth = getAuth(app);
const imgdb = getStorage(app);

const RegisterForm = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('Learner');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [education, setEducation] = useState('Pre Graduate');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const userRef = collection(db, "users");

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    }
  };

  const handleRegisterClick = async () => {
    if (!profileImage) {
      setError("Profile image is required");
      return;
    }

    if (!email) {
      setError("Email is required");
      return;
    }

    if (!username) {
      setError("Username is required");
      return;
    }

    if (!phone) {
      setError("Phone number is required");
      return;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      setError("Phone number must be 10 digits");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (!education) {
      setError("Education level is required");
      return;
    }
    navigate('/');
    // If validation passes, reset the error and proceed with registration
    setError('');

    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const user = result.user;
      const { uid } = user;
      console.log(uid);
      const imgRef = ref(imgdb, `uploads/images/${Date.now()}-${profileImage.name}`);
      const uploadResult = await uploadBytes(imgRef, profileImage);
      const downloadURL = await getDownloadURL(uploadResult.ref);
      const userDoc = doc(db, "users", uid);
      await setDoc(userDoc, {
        uid,
        Email: email,
        Username: username,
        Phone: phone,
        Role: role,
        Password: password,
        Education: education,
        ProfileImage: downloadURL
      });

      // Redirect to login page

    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="register-form">
      <h2>Register</h2>
      <form >
        <div className="feilds" style={{display:'flex', justifyContent:'space-between'}}>
        <div className="leftForm" style={{width:'45%'}}>
          <div className="form-group">
            <label>Profile Image:</label>
            <input type="file" onChange={handleImageChange} />
          </div>
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
            <label>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Phone:</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="rightForm"  style={{width:'45%'}}>
          <div className="form-group">
            <label>Role:</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="Learner">Learner</option>
              <option value="Teacher">Teacher</option>
            </select>
          </div>
          <div className="form-group">
            <label>Education:</label>
            <select value={education} onChange={(e) => setEducation(e.target.value)}>
              <option value="Pre Graduate">Pre Graduate</option>
              <option value="Post Graduate">Post Graduate</option>
            </select>
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
          <div className="form-group">
            <label>Confirm Password:</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
        </div>
          </div>
        {error && <p className="error">{error}</p>}
        <button type="button" onClick={handleRegisterClick}>Register</button>
      </form>
      <p>Already have an account? <Link to="/">Login here</Link></p>
    </div>
  );
};

export default RegisterForm;
