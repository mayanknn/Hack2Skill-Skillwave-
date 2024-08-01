import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import { app } from '../../../firebase';
import Card from './Card';

const db = getFirestore(app);

const Events = () => {
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const navigate = useNavigate();
  const cardsRef = useRef(null); // Create a reference for cards-events div

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'events'));
        const cardsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCards(cardsData);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchData();
  }, []);

  const handleShowMore = (card) => {
    setSelectedCard(card);
  };

  const handleClosePopup = () => {
    setSelectedCard(null);
  };

  const handleExploreClick = () => {
    if (cardsRef.current) {
      cardsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDownloadPdf = async (url) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = 'Event_Details.pdf'; // Optionally specify the file name
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Optionally revoke the Blob URL after download
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', color: '#333', margin: 0, padding: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100vw', height: '100vh', position: 'absolute', top: 0, left: 0, background: '#f4f7f9' }}>
        <div style={{ width: '40%', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '20px', color: '#1a1a1a', textAlign: 'left' }}>Welcome to Our Events Portal!</h1>
          <p style={{ fontSize: '1rem', marginBottom: '30px', color: '#555', textAlign: 'left' }}>At Our Events Portal, we bring you a curated selection of exciting events that cater to a wide range of interests. Whether you're looking to network, learn something new, or just have fun, we have something for everyone.</p>
          <button onClick={handleExploreClick} style={{ borderRadius: '12px', boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px', border: 'none', color: 'white', padding: '0.75rem 1.25rem', margin: '1rem', display: 'inline-block', fontWeight: '400', textAlign: 'center', verticalAlign: 'middle', userSelect: 'none', background: 'linear-gradient(90deg, rgba(19, 75, 187, 1) 0%, rgba(76, 23, 107, 1) 100%)', border: '1px solid transparent', fontSize: '1rem', lineHeight: '1.5', width: '50%' }}>Explore Events</button>
          <button onClick={() => navigate('/events/event-details')} style={{ borderRadius: '12px', boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px', border: 'none', color: 'white', padding: '0.75rem 1.25rem', margin: '1rem', display: 'inline-block', fontWeight: '400', textAlign: 'center', verticalAlign: 'middle', userSelect: 'none', background: 'linear-gradient(90deg, rgba(19, 75, 187, 1) 0%, rgba(76, 23, 107, 1) 100%)', border: '1px solid transparent', fontSize: '1rem', lineHeight: '1.5', width: '50%' }}>Add Events</button>
        </div>
        <div style={{ width: '60%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <img src="https://hack2skill.com/home/img/hero-main-char.svg" alt="" style={{ width: '50%', borderRadius: '8px' }} />
          <img src="https://s3bucket-incpro.s3.eu-north-1.amazonaws.com/2022-03-04T12%3A37%3A30.012Z-hero_svg_design_v2.webp" alt="" style={{ width: '50%', borderRadius: '8px' }} />
        </div>
      </div>

      <div className='cards-events' ref={cardsRef} style={{ width: '100vw', backgroundColor: '#fff', padding: '20px', display: 'flex', flexWrap: 'wrap', gap: '20px', position: 'relative', top: '100vh' }}>
        {cards.map((card, index) => (
          <Card
            key={index}
            eventName={card.eventName}
            mode={card.mode}
            registrationClosingDate={card.registrationClosingDate}
            description={card.description}
            imageUrl={card.imageUrl}
            onShowMore={() => handleShowMore(card)}
          />
        ))}
      </div>

      {selectedCard && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px', maxWidth: '500px', width: '90%' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '10px', color: '#1a1a1a' }}>{selectedCard.eventName}</h2>
            <p style={{ fontSize: '1rem', marginBottom: '10px', color: '#555' }}><strong>Mode:</strong> {selectedCard.mode}</p>
            <p style={{ fontSize: '1rem', marginBottom: '10px', color: '#555' }}><strong>Registration Closing Date:</strong> {new Date(selectedCard.registrationClosingDate) < new Date() ? 'Closed' : selectedCard.registrationClosingDate}</p>
            {selectedCard.mode !== 'Online' && (
              <p style={{ fontSize: '1rem', marginBottom: '10px', color: '#555' }}><strong>Location:</strong> {selectedCard.location}</p>
            )}
            <p style={{ fontSize: '1rem', marginBottom: '10px', color: '#555' }}><strong>Description:</strong> {selectedCard.description}</p>
            {selectedCard.pdfUrl && (
              <p style={{ fontSize: '1rem', marginBottom: '10px', color: '#555' }}>
                <button 
                  onClick={() => handleDownloadPdf(selectedCard.pdfUrl)} 
                  style={{ color: '#1a73e8', textDecoration: 'none', border: 'none', background: 'none', cursor: 'pointer' }}
                >
                  Download Event Details PDF
                </button>
              </p>
            )}
            <button onClick={handleClosePopup} style={{ background: '#ff4d4d', border: 'none', color: 'white', padding: '0.75rem 1.25rem', borderRadius: '8px', fontSize: '1rem', cursor: 'pointer', transition: 'background 0.3s ease' }}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
