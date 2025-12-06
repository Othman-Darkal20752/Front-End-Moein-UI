// src/pages/AccountManagement.jsx - GitHub Style
import React from 'react';
import DeleteAccountModal from '../components/modals/DeleteAccountModal';
import AccountUpdateForm from '../components/forms/AccountUpdateForm';
import { useAccountManager } from '../hooks/useAccountManager';

const AccountManagement = () => {
  const {
    userData,
    loading,
    message,
    showDeleteModal,
    setShowDeleteModal,
    isDeleting,
    isUpdating,
    handleUpdateAccount,
    handleDeleteAccount,
    getInitialValues,
    setMessage,
  } = useAccountManager();

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const success = await handleUpdateAccount(values);
    
    if (success) {
      resetForm({
        values: {
          ...values,
          password: '',
          confirmPassword: '',
        }
      });
    }
    
    setSubmitting(false);
  };

  const handleDeleteConfirm = async (password) => {
    await handleDeleteAccount(password);
    setShowDeleteModal(false);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'inline-block', animation: 'spin 1s linear infinite', borderRadius: '50%', width: '2rem', height: '2rem', borderTop: '2px solid var(--color-blue)', borderBottom: '2px solid var(--color-blue)', marginBottom: '1rem' }}></div>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>Loading account data...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-text-primary)', marginBottom: '0.5rem' }}>
          Account Management
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
          Update your account information
        </p>
      </div>

      {/* Message Alert */}
      {message && (
        <div style={{
          marginBottom: '1.5rem',
          padding: '1rem',
          borderRadius: '0.5rem',
          border: `1px solid ${message.includes('✅') ? 'var(--color-green)' : 'var(--color-red)'}`,
          backgroundColor: message.includes('✅') ? 'var(--color-green-bg)' : 'var(--color-red-bg)',
          color: message.includes('✅') ? 'var(--color-green)' : 'var(--color-red)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: '0.5rem' }}>{message.includes('✅') ? '✅' : '⚠️'}</span>
              <span style={{ fontSize: '0.875rem' }}>{message}</span>
            </div>
            <button 
              onClick={() => setMessage(null)}
              style={{
                background: 'none',
                border: 'none',
                color: 'inherit',
                cursor: 'pointer',
                fontSize: '1.125rem'
              }}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* User Profile Card */}
      {userData && (
        <div style={{
          marginBottom: '2rem',
          backgroundColor: 'var(--color-bg-primary)',
          border: '1px solid var(--color-border)',
          borderRadius: '0.5rem',
          padding: '1.5rem'
        }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: '1rem' }}>Your Information</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: '500' }}>Username</div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{
                  width: '2rem',
                  height: '2rem',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-blue-bg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '0.75rem',
                  color: 'var(--color-blue)',
                  fontWeight: '600',
                  fontSize: '0.875rem'
                }}>
                  {userData.user?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div style={{ fontWeight: '600', color: 'var(--color-text-primary)' }}>
                  {userData.user?.username || 'Not set'}
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: '500' }}>Email</div>
              <div style={{ fontWeight: '500', color: 'var(--color-text-primary)', display: 'flex', alignItems: 'center' }}>
                <svg style={{ width: '1rem', height: '1rem', marginRight: '0.5rem', color: 'var(--color-text-muted)' }} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                {userData.user?.email || 'Not set'}
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: '500' }}>Phone Number</div>
              <div style={{ fontWeight: '500', color: 'var(--color-text-primary)', display: 'flex', alignItems: 'center' }}>
                <svg style={{ width: '1rem', height: '1rem', marginRight: '0.5rem', color: 'var(--color-text-muted)' }} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                {userData.user?.phone || 'Not set'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Update Form */}
      <div style={{
        backgroundColor: 'var(--color-bg-primary)',
        border: '1px solid var(--color-border)',
        borderRadius: '0.5rem',
        padding: '1.5rem',
        marginBottom: '2rem'
      }}>
        <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: '1.5rem' }}>Update your data</h2>
        <AccountUpdateForm
          initialValues={getInitialValues()}
          onSubmit={handleSubmit}
          isSubmitting={isUpdating}
          onReset={() => {}}
          userData={userData}
        />
      </div>

      {/* Danger Zone */}
      <div style={{
        backgroundColor: 'var(--color-bg-primary)',
        border: '1px solid var(--color-red)',
        borderRadius: '0.5rem',
        padding: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
          <div style={{
            width: '2rem',
            height: '2rem',
            borderRadius: '50%',
            backgroundColor: 'var(--color-red-bg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '0.75rem',
            color: 'var(--color-red)',
            fontWeight: 'bold'
          }}>
            !
          </div>
          <h2 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--color-red)' }}>Danger Zone</h2>
        </div>
        
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
          When you delete your account, all your data will be permanently removed. This action cannot be undone.
        </p>
        
        <button
          onClick={() => setShowDeleteModal(true)}
          className="btn btn-danger"
        >
          Delete Account
        </button>
      </div>

      {/* Delete Account Modal */}
      <DeleteAccountModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default AccountManagement;