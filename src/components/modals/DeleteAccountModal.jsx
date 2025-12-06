// src/components/modals/DeleteAccountModal.jsx - GitHub Style
import React, { useState } from 'react';

const DeleteAccountModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  isLoading = false 
}) => {
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password.trim()) {
      onConfirm(password);
      setPassword('');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal" style={{ maxWidth: '28rem' }}>
        {/* Modal Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: '600', color: 'var(--color-text-primary)' }}>
              Delete Account
            </h3>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-text-secondary)',
                cursor: 'pointer',
                fontSize: '1.25rem',
                padding: 0,
                opacity: isLoading ? 0.5 : 1,
                pointerEvents: isLoading ? 'none' : 'auto'
              }}
              disabled={isLoading}
            >
              <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <p style={{ marginTop: '0.25rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
            This process is irreversible. Please confirm your password to proceed.
          </p>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                <div style={{ flexShrink: 0 }}>
                  <div style={{
                    width: '2rem',
                    height: '2rem',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-red-bg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <span style={{ color: 'var(--color-red)', fontWeight: 'bold' }}>!</span>
                  </div>
                </div>
                <div style={{ marginLeft: '0.75rem' }}>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--color-red)', margin: 0 }}>
                    Warning: Deleting your account
                  </h4>
                  <p style={{ marginTop: '0.25rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)', margin: 0 }}>
                    Your account and all associated data will be permanently deleted. This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>

            <div className="input-field">
              <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-primary)' }}>
                Enter your password to confirm deletion
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="current password"
                className="form-input"
                autoFocus
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Modal Footer */}
          <div className="modal-footer">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="btn btn-ghost"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={isLoading || !password.trim()}
              className="btn btn-danger"
            >
              {isLoading ? 'Deleting...' : 'Delete Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeleteAccountModal;