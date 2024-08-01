import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { app } from '../firebase'; // Ensure Firebase is configured correctly
import { collection, addDoc, updateDoc, getFirestore } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, getStorage } from 'firebase/storage';

import { app } from '../../../firebase';
const db = getFirestore(app);
const storage = getStorage(app);
const EventDetails = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    type: 'organization', // Default value for type
    registrationClosingDate: '',
    mode: 'Offline',
    location: '',
    description: '',
    eventDetails: null,
    imageUrl: null,
    eventName: '',
  });
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: files ? files[0] : value, }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const imageRef = ref(storage, `events/images/${formData.imageUrl.name}`);
      await uploadBytes(imageRef, formData.imageUrl);
      const imageUrl = await getDownloadURL(imageRef);
      const pdfRef = ref(storage, `events/pdfs/${formData.eventDetails.name}`);
      await uploadBytes(pdfRef, formData.eventDetails);
      const pdfUrl = await getDownloadURL(pdfRef);
      const docRef = await addDoc(collection(db, 'events'), {
        eventName: formData.eventName,
        type: formData.type,
        registrationClosingDate: formData.registrationClosingDate,
        mode: formData.mode,
        location: formData.location,
        description: formData.description,
        pending: true,
        imageUrl,
        pdfUrl,
      });
      await updateDoc(docRef, { id: docRef.id });
      navigate('/');
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };
  return (
    <div className="form-container" >
      <h2 style={{textAlign:'center'}}>Event Details</h2>
      <form onSubmit={handleSubmit}>
        <div style={{width:'60vw' ,display:'flex',justifyContent:'space-between'}}>
          <div style={{width:'40%',padding:'2vw'}}>
            <div className="form-group">
              <label htmlFor="eventName">Event Name:</label>
              <input type="text" id="eventName" name="eventName" value={formData.eventName} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="type">Type:</label>
              <select id="type" name="type" value={formData.type} onChange={handleChange} required           >
                <option value="organization">Organization</option>
                <option value="college">College</option>
                <option value="community">Community</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="registrationClosingDate">Registration Closing Date:</label>
              <input type="date" id="registrationClosingDate" name="registrationClosingDate" value={formData.registrationClosingDate} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="mode">Mode of Conducting Event:</label>
              <select id="mode" name="mode" value={formData.mode} onChange={handleChange} required>
                <option value="Offline">Offline</option>
                <option value="Online">Online</option>
                <option value="Both">Both Online and Offline</option>
              </select>
            </div>
          </div>
          <div style={{width:'40%',padding:'2vw'}}>
            {formData.mode !== 'Online' && (
              <div className="form-group">
                <label htmlFor="location">Location:</label>
                <input type="text" id="location" name="location" value={formData.location} onChange={handleChange} required />
              </div>
            )}
            <div className="form-group">
              <label htmlFor="description">Description:</label>
              <textarea id="description" name="description" value={formData.description} onChange={handleChange} required></textarea>
            </div>
            <div className="form-group">
              <label htmlFor="eventDetails">Event Details PDF:</label>
              <input type="file" id="eventDetails" name="eventDetails" onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="imageUrl">Event Image:</label>
              <input type="file" id="imageUrl" name="imageUrl" accept="image/*" onChange={handleChange} required />
            </div>
          </div>
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default EventDetails;
