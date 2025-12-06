// src/components/forms/FloatingButton.jsx
import React from 'react';

const FloatingButton = ({ onClick, title = 'Add', className = '' }) => {
  return (
    <button
      className="btn btn-primary"
      style={{
        position: 'fixed',
        bottom: '1.5rem',
        right: '1.5rem',
        width: '3.5rem',
        height: '3.5rem',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        fontSize: '1.5rem',
        fontWeight: 'bold',
        zIndex: 40
      }}
      aria-label={title}
      onClick={onClick}
      title={title}
    >
      +
    </button>
  );
};

export default FloatingButton;