import React from 'react';

const Card = ({ eventName, mode, registrationClosingDate, description, imageUrl, onShowMore }) => {
  const isRegistrationClosed = new Date(registrationClosingDate) < new Date();

  return (
    <div
      className="card"
      style={{
        borderRadius: '12px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        backgroundColor: '#ffffff',
        border: '1px solid #e0e0e0',
        maxWidth: '300px',
        margin: '1rem',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height:'60vh'
      }}
    >
      {imageUrl && (
        <img
          src={imageUrl}
          alt={eventName}
          className="card-image"
          style={{
           height:'50%',
            objectFit: 'cover',
            borderBottom: '1px solid #e0e0e0',
          }}
        />
      )}
      <div
        className="card-content"
        style={{
          padding: '1rem',
          color: '#333333',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
        }}
      >
        <h3
          className="card-content-title"
          style={{
            margin: '0',
            fontSize: '1.25rem',
            color: '#007bff', // Bluish color for title
            fontWeight: '600',
          }}
        >
          {eventName}
        </h3>
        <p
          className="card-content-text"
          style={{
            margin: '0',
            fontSize: '1rem',
            color: '#555555',
          }}
        >
          <strong>Mode:</strong> {mode}
        </p>
        <p
          className="card-content-text"
          style={{
            margin: '0',
            fontSize: '1rem',
            color: '#555555',
          }}
        >
          <strong>Registration Closing Date:</strong> {isRegistrationClosed ? 'Registration Closed' : registrationClosingDate}
        </p>
        <button
          className="show-more-button"
          onClick={onShowMore}
          style={{
            backgroundColor: '#007bff', // Bluish color for button
            color: '#ffffff',
            border: 'none',
            borderRadius: '4px',
            padding: '0.5rem 1rem',
            fontSize: '1rem',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease, transform 0.3s ease',
            marginTop: 'auto',
          }}
        >
          Show More
        </button>
      </div>
    </div>
  );
};

export default Card;
