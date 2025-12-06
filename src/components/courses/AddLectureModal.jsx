// src/components/courses/AddLectureModal.jsx
import React, { useState } from 'react';
import { createLecture } from '../../api';

const AddLectureModal = ({ 
  courseId, 
  courseName, 
  isOpen, 
  onClose, 
  onSuccess 
}) => {
  const [lectureName, setLectureName] = useState('');
  const [file, setFile] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setSelectedFileName(selectedFile.name);
      
      // Auto-fill lecture name from file name
      const fileNameWithoutExt = selectedFile.name.replace(/\.[^/.]+$/, "");
      setLectureName(fileNameWithoutExt);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!lectureName.trim()) {
      setError('Enter Lecture Name');
      return;
    }

    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setMessage('uploading...');

    try {
      const formData = new FormData();
      formData.append('lecture_name', lectureName);
      formData.append('file', file);

      // إزالة المحاكاة والتقدم الوهمي
      // الاتصال الحقيقي بالـ backend فقط
      await createLecture(courseId, formData);
      
      // عند النجاح
      setMessage('Lecture added successfully!');
      
      // إغلاق النافذة وإعادة التعيين
      setTimeout(() => {
        onSuccess();
        resetForm();
        onClose();
      }, 1500);
      
    } catch (err) {
      console.error('Error creating lecture:', err);
      // رسائل خطأ حقيقية من الـ backend
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.detail || 
                          err.message || 
                          'Failed to add lecture. Please try again.';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  const resetForm = () => {
    setLectureName('');
    setFile(null);
    setSelectedFileName('');
    setUploadProgress(0);
    setMessage(null);
    setError(null);
  };

  const getFileIcon = (fileName) => {
    if (!fileName) return '📄';
    if (fileName.toLowerCase().endsWith('.pptx') || fileName.toLowerCase().endsWith('.ppt')) return '📊';
    if (fileName.toLowerCase().endsWith('.docx') || fileName.toLowerCase().endsWith('.doc')) return '📝';
    if (fileName.toLowerCase().endsWith('.txt')) return '📄';
    if (fileName.toLowerCase().endsWith('.pdf')) return '📕';
    return '📁';
  };

  return (
    <div className="modal-overlay">
      <div className="modal" style={{ maxWidth: '60rem' }}>
        {/* Modal Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: '600', color: 'var(--color-text-primary)' }}>
                Add Lecture
              </h3>
              <p style={{ marginTop: '0.25rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                To course: <span style={{ fontWeight: '500' }}>{courseName}</span>
              </p>
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-text-secondary)',
                cursor: 'pointer',
                fontSize: '1.25rem',
                padding: 0,
                opacity: isSubmitting ? 0.5 : 1,
                pointerEvents: isSubmitting ? 'none' : 'auto'
              }}
              disabled={isSubmitting}
            >
              <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Lecture Name */}
            <div className="input-field">
              <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-primary)' }}>
                Lecture Name *
              </label>
              <input
                type="text"
                value={lectureName}
                onChange={(e) => setLectureName(e.target.value)}
                placeholder="Introduction to React Hooks"
                className="form-input"
                required
                disabled={isSubmitting}
              />
            </div>

            {/* File Upload */}
            <div className="input-field">
              <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-primary)' }}>
                Lecture File *
              </label>
              
              <div 
                style={{
                  border: `2px dashed ${selectedFileName ? 'var(--color-blue)' : 'var(--color-border)'}`,
                  borderRadius: '0.5rem',
                  padding: '1.5rem',
                  textAlign: 'center',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  backgroundColor: selectedFileName ? 'var(--color-blue-bg)' : 'transparent',
                  opacity: isSubmitting ? 0.6 : 1
                }}
                onClick={() => !isSubmitting && document.getElementById('file-upload').click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.currentTarget.style.borderColor = 'var(--color-blue)';
                  e.currentTarget.style.backgroundColor = 'var(--color-blue-bg)';
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  e.currentTarget.style.borderColor = selectedFileName ? 'var(--color-blue)' : 'var(--color-border)';
                  e.currentTarget.style.backgroundColor = selectedFileName ? 'var(--color-blue-bg)' : 'transparent';
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.currentTarget.style.borderColor = 'var(--color-border)';
                  e.currentTarget.style.backgroundColor = 'transparent';
                  handleFileChange({ target: { files: e.dataTransfer.files } });
                }}
              >
                {selectedFileName ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '1.5rem' }}>{getFileIcon(selectedFileName)}</span>
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontWeight: '500', color: 'var(--color-text-primary)' }}>{selectedFileName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>
                        File size: {(file?.size / (1024*1024)).toFixed(2)} MB • Click to change
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>📤</div>
                    <div style={{ fontWeight: '500', color: 'var(--color-text-primary)', marginBottom: '0.25rem' }}>
                      Drag & drop file or click to select
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                      Supports: PPTX, DOCX, DOC, TXT, PDF (Max 10MB)
                    </div>
                  </>
                )}
              </div>
              
              <input
                id="file-upload"
                type="file"
                accept=".pptx,.docx,.doc,.txt,.pdf"
                onChange={handleFileChange}
                style={{ display: 'none' }}
                disabled={isSubmitting}
              />
            </div>

            {/* Upload Progress */}
            {isSubmitting && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>
                  <span>Uploading to server...</span>
                  <span>Please wait</span>
                </div>
                <div style={{ width: '100%', height: '0.5rem', backgroundColor: 'var(--color-bg-secondary)', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', backgroundColor: 'var(--color-blue)', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}></div>
                </div>
              </div>
            )}
          </div>

          {/* Messages */}
          {(message || error) && (
            <div style={{
              margin: '0 1.5rem 1rem',
              padding: '0.75rem',
              borderRadius: '0.5rem',
              border: `1px solid ${message ? 'var(--color-green)' : 'var(--color-red)'}`,
              backgroundColor: message ? 'var(--color-green-bg)' : 'var(--color-red-bg)',
              color: message ? 'var(--color-green)' : 'var(--color-red)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '0.5rem' }}>{message ? '✓' : '⚠️'}</span>
                <span style={{ fontSize: '0.875rem' }}>{message || error}</span>
              </div>
            </div>
          )}

          {/* Modal Footer */}
          <div className="modal-footer">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="btn btn-ghost"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={isSubmitting || !lectureName.trim() || !file}
              className="btn btn-primary"
            >
              {isSubmitting ? 'Uploading...' : 'Upload Lecture'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLectureModal;