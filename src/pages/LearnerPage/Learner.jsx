import React, { useContext } from 'react'
import { Navigate, Outlet, useNavigate } from 'react-router-dom'
import MyVideos from '../TeacherPage/Tcomponents/MyVideos';
import { IoClose } from 'react-icons/io5';

import { ShowProfileContext } from '../../context/showProfile';

function Learner() {
  const { showProfile, setShowProfile } = useContext(ShowProfileContext);
  const navigate = useNavigate();
  let user = localStorage.getItem('userData');
  const userData = JSON.parse(user)
  function handleLogOut(){
      localStorage.removeItem('userData')
      setShowProfile(false);
      navigate('/')
  }

  return (
    <div className="teacher-dashboard">
    <nav className="navbar">
    <img src="https://www.logomaker.com/api/main/images/1j+ojFVDOMkX9Wytexe43D6kh...6ArRZNnhvEwXs1M3EMoAJtlyIvg...Bp...Pk+" alt=""  style={{width:'8vw'}}/>
    <ul className="nav-links" style={{ display:'flex'  , alignItems:'center',width:'90%'}}>
        
      

       
        <li><a onClick={() => navigate('/learner/videos')}>Videos</a></li>
        <li><a onClick={() => navigate('/learner/my-problem-statements')}>SkillCode</a></li>
        <li><a onClick={() => navigate('/learner/preference')}>Add / Edit Preference</a></li>
        <li><a onClick={()=> navigate('/events')}>Events</a></li>
        <li><a onClick={()=> navigate('/learner/yt-summary')}>AI Summarization</a></li>
        <li><a onClick={()=> navigate('/learner/roadmap')}>Personalised RoadMap</a></li>
        <li><a onClick={() => setShowProfile(true)}>Profile</a></li>
      </ul>
    </nav>

    {showProfile && (
        <div
          className="profile-popup"
          style={{
            position: 'absolute',
            backgroundColor: '#fff',
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            maxWidth: '400px',
            margin: '20px auto',
            textAlign: 'left',
          }} >
          <h2
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              marginBottom: '20px',
              textAlign: 'center',
              color: '#2D3748',
            }}
          > Profile </h2>
          <IoClose
            onClick={() => setShowProfile(false)}
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              cursor: 'pointer',
              color: '#E53E3E',
              fontSize: '20px',
            }} />
          <img src={userData.ProfileImage}
            alt="Profile"
            style={{
              borderRadius: '50%',
              width: '150px',
              height: '150px',
              objectFit: 'cover',
              display: 'block',
              margin: '0 auto 20px',
            }} />
          <div className="profile-details" style={{ marginBottom: '20px' }}>
            <p style={{ marginBottom: '10px', color: '#4A5568' }}>
              <strong>Name:</strong> {userData.Username}
            </p>
            <p style={{ marginBottom: '10px', color: '#4A5568' }}>
              <strong>Email:</strong> {userData.Email}
            </p>
            <p style={{ marginBottom: '10px', color: '#4A5568' }}>
              <strong>Role:</strong> {userData.Role}
            </p>
          </div>
          <button className="profile-button"
            style={{
              width: '100%',
              padding: '10px 0',
              backgroundColor: '#3182CE',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              marginBottom: '10px',
            }} > Edit Profile </button>
          <button
            className="logout-button"
            onClick={handleLogOut}
            style={{
              width: '100%',
              padding: '10px 0',
              backgroundColor: '#E53E3E',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Logout
          </button>
      </div>
    )}
    <Outlet />  
  </div>
  )
}
export default Learner;