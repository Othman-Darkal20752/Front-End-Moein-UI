/**
 * Spinner.jsx - Reusable loading spinner component
 */
import React from 'react';

const Spinner = ({
  size = 'md',
  variant = 'primary',
  text = null,
  fullscreen = false,
}) => {
  const sizeStyles = {
    sm: { width: '1rem', height: '1rem' },
    md: { width: '2rem', height: '2rem' },
    lg: { width: '3rem', height: '3rem' },
  };

  const variantBorderColors = {
    primary: 'var(--color-blue)',
    secondary: 'var(--color-text-secondary)',
    success: 'var(--color-green)',
  };

  const containerStyle = fullscreen
    ? {
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 50
      }
    : {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      };

  return (
    <div style={containerStyle}>
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            display: 'inline-block',
            animation: 'spin 1s linear infinite',
            borderRadius: '50%',
            border: `2px solid ${variantBorderColors[variant]}`,
            borderTopColor: 'transparent',
            ...sizeStyles[size]
          }}
        />
        {text && (
          <p style={{ marginTop: '0.75rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>{text}</p>
        )}
      </div>
    </div>
  );
};

export default Spinner;
