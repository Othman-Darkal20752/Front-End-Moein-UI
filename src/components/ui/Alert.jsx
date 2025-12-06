/**
 * Alert.jsx - Reusable alert/message component
 */
import React from 'react';

const Alert = ({ type = 'info', message = null, onDismiss = null }) => {
  if (!message) return null;

  const typeStyles = {
    success: {
      bg: 'var(--color-green-bg)',
      border: 'var(--color-green)',
      text: 'var(--color-green)',
      icon: '✅',
    },
    error: {
      bg: 'var(--color-red-bg)',
      border: 'var(--color-red)',
      text: 'var(--color-red)',
      icon: '❌',
    },
    warning: {
      bg: 'var(--color-yellow-bg)',
      border: 'var(--color-yellow)',
      text: 'var(--color-yellow)',
      icon: '⚠️',
    },
    info: {
      bg: 'var(--color-blue-bg)',
      border: 'var(--color-blue)',
      text: 'var(--color-blue)',
      icon: 'ℹ️',
    },
  };

  const style = typeStyles[type] || typeStyles.info;

  return (
    <div
      style={{
        marginBottom: '1rem',
        padding: '1rem',
        borderRadius: '0.5rem',
        border: `1px solid ${style.border}`,
        backgroundColor: style.bg,
        color: style.text
      }}
      role="alert"
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ marginRight: '0.75rem', fontSize: '1.125rem' }}>{style.icon}</span>
          <span style={{ fontSize: '0.875rem' }}>{message}</span>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            style={{
              marginLeft: '0.5rem',
              background: 'none',
              border: 'none',
              color: 'inherit',
              cursor: 'pointer',
              fontSize: '1.125rem',
              padding: 0
            }}
            aria-label="Dismiss"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;
