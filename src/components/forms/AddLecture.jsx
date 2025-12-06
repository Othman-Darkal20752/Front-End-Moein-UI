// components/AddLecture.js
import React, { useState } from 'react';
import { createLecture } from '../../api';
import { Formik, Form } from 'formik';
import InputField from './InputField';
import * as Yup from 'yup';

const initial = { 
  lecture_name: '',  // غيرنا من title إلى file_name
  file: null 
};

const validationSchema = Yup.object().shape({
  lecture_name: Yup.string().required('File name is required'), // غيرنا
  file: Yup.mixed()
    .required('File is required')
    .test(
      'fileFormat',
      'Unsupported file format. Please upload .pptx, .docx, .doc, .txt, or .pdf files',
      (value) => {
        if (!value) return false;
        const allowedTypes = [
          'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
          'application/msword', // .doc
          'text/plain', // .txt
          'application/pdf' // .pdf
        ];
        const allowedExtensions = ['.pptx', '.docx', '.doc', '.txt', '.pdf'];
        
        // Check by MIME type
        if (allowedTypes.includes(value.type)) return true;
        
        // Check by file extension as fallback
        const fileName = value.name.toLowerCase();
        return allowedExtensions.some(ext => fileName.endsWith(ext));
      }
    )
    .test(
      'fileSize',
      'File size is too large. Maximum size is 10MB',
      (value) => {
        if (!value) return false;
        return value.size <= 10 * 1024 * 1024; // 10MB
      }
    )
});

const AddLecture = ({ courseId, courseName, onLectureAdded, onCancel }) => {
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [selectedFileName, setSelectedFileName] = useState('');

    const handleCreateLecture = async (values, { setSubmitting }) => {
        console.log('Adding lecture to courseId:', courseId);
        console.log('Values:', values);
        
        if (!courseId) {
            setError('Cannot add lecture: course id missing');
            setTimeout(() => setError(null), 2500);
            setSubmitting(false);
            return;
        }

        setMessage('Uploading lecture...');
        setUploadProgress(0);

        try {
            // Create FormData for file upload
            const formData = new FormData();
            formData.append('lecture_name', values.lecture_name); // غيرنا
            formData.append('file', values.file); // الملف نفسه
            
            // Log FormData contents
            console.log('FormData contents:');
            for (let [key, value] of formData.entries()) {
                console.log(`${key}:`, value);
            }
            
            // Simulate upload progress
            const progressInterval = setInterval(() => {
                setUploadProgress(prev => {
                    if (prev >= 90) {
                        clearInterval(progressInterval);
                        return 90;
                    }
                    return prev + 10;
                });
            }, 200);

            // Create lecture with file
            const res = await createLecture(courseId, formData);
            
            clearInterval(progressInterval);
            setUploadProgress(100);
            
            console.log('Lecture created successfully:', res);
            
            // Extract the new lecture from response
            const newLecture = res?.data || res;

            setMessage('✓ Lecture added successfully!');
            setTimeout(() => {
                setMessage(null);
                setUploadProgress(0);
                setSelectedFileName('');
                if (onLectureAdded) onLectureAdded(newLecture);
            }, 1500);
        } catch (err) {
            console.error('createLecture error', err);
            console.error('Error details:', err.response?.data);
            
            setError(err.response?.data?.message || err.response?.data?.detail || 'Could not add lecture. Please try again.');
            setUploadProgress(0);
            setTimeout(() => setError(null), 2500);
        } finally {
            setSubmitting(false);
        }
    };

    const handleFileChange = (event, setFieldValue) => {
        const file = event.currentTarget.files[0];
        if (file) {
            setFieldValue('file', file);
            setSelectedFileName(file.name);
            
            // Auto-fill file_name from file name (without extension)
            const fileNameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
            setFieldValue('lecture_name', fileNameWithoutExt);
        }
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
        <div className="modal-overlay" onClick={onCancel}>
            <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
                <div className="modal-header">
                    <h3 style={{ margin: 0 }}>Add Lecture to {courseName}</h3>
                    <button 
                        type="button" 
                        className="btn btn-ghost"
                        onClick={onCancel}
                        style={{ padding: '6px 12px' }}
                    >
                        ✕
                    </button>
                </div>
                <Formik
                    initialValues={initial}
                    validationSchema={validationSchema}
                    onSubmit={handleCreateLecture}
                >
                    {({ isSubmitting, setFieldValue, values }) => (
                        <Form>
                            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <InputField 
                                    name="lecture_name" 
                                    label="Lecture Name *" 
                                    placeholder="e.g. Introduction to React Hooks" 
                                    value={values.lecture_name}
                                />
                                
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--color-text-primary)', fontSize: '0.875rem' }}>
                                        Lecture File *
                                    </label>
                                    
                                    <div style={{ 
                                        border: `2px dashed ${selectedFileName ? 'var(--color-blue)' : 'var(--color-border)'}`, 
                                        borderRadius: '0.5rem', 
                                        padding: '1.5rem', 
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                        backgroundColor: selectedFileName ? 'var(--color-blue-bg)' : 'transparent',
                                        transition: 'all 0.3s ease',
                                        opacity: isSubmitting ? 0.6 : 1
                                    }}
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
                                        const files = e.dataTransfer.files;
                                        if (files && files[0]) {
                                            const file = files[0];
                                            setFieldValue('file', file);
                                            setSelectedFileName(file.name);
                                            
                                            // Auto-fill file_name from file name
                                            const fileNameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
                                            setFieldValue('lecture_name', fileNameWithoutExt);
                                        }
                                    }}
                                    onClick={() => !isSubmitting && document.getElementById('file-upload').click()}
                                    >
                                        {selectedFileName ? (
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
                                                <span style={{ fontSize: '1.5rem' }}>{getFileIcon(selectedFileName)}</span>
                                                <div style={{ textAlign: 'left' }}>
                                                    <div style={{ fontWeight: '500', color: 'var(--color-text-primary)' }}>{selectedFileName}</div>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>
                                                        Size: {(values.file?.size / (1024*1024)).toFixed(2)} MB • Click to change
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>📤</div>
                                                <div style={{ fontWeight: '500', marginBottom: '0.25rem', color: 'var(--color-text-primary)' }}>
                                                    Drag & drop or click to upload
                                                </div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                                                    Supports: PPTX, DOCX, DOC, TXT, PDF (Max 10MB)
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    
                                    <input
                                        id="file-upload"
                                        name="file"
                                        type="file"
                                        accept=".pptx,.docx,.doc,.txt,.pdf,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword,text/plain,application/pdf"
                                        onChange={(e) => handleFileChange(e, setFieldValue)}
                                        style={{ display: 'none' }}
                                        disabled={isSubmitting}
                                    />
                                    
                                    <InputField 
                                        name="file" 
                                        type="hidden"
                                        label="" 
                                    />
                                </div>

                                {uploadProgress > 0 && (
                                    <div>
                                        <div style={{ 
                                            display: 'flex', 
                                            justifyContent: 'space-between', 
                                            marginBottom: '0.5rem',
                                            fontSize: '0.875rem',
                                            color: 'var(--color-text-secondary)'
                                        }}>
                                            <span>Uploading...</span>
                                            <span>{uploadProgress}%</span>
                                        </div>
                                        <div style={{ 
                                            width: '100%', 
                                            height: '0.5rem', 
                                            backgroundColor: 'var(--color-bg-secondary)', 
                                            borderRadius: '9999px',
                                            overflow: 'hidden'
                                        }}>
                                            <div style={{ 
                                                width: `${uploadProgress}%`, 
                                                height: '100%', 
                                                backgroundColor: 'var(--color-blue)',
                                                transition: 'width 0.3s ease'
                                            }}></div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="modal-footer">
                                <button 
                                    type="button" 
                                    className="btn btn-ghost"
                                    onClick={onCancel} 
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="btn btn-primary" 
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Uploading…' : 'Upload Lecture'}
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>

                {message && (
                    <div style={{
                        marginTop: '1.5rem',
                        padding: '0.75rem',
                        borderRadius: '0.5rem',
                        backgroundColor: 'var(--color-green-bg)',
                        color: 'var(--color-green)',
                        border: `1px solid var(--color-green)`,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.875rem'
                    }}>
                        <span style={{ fontSize: '1.125rem' }}>✓</span>
                        {message}
                    </div>
                )}
                
                {error && (
                    <div style={{
                        marginTop: '1.5rem',
                        padding: '0.75rem',
                        borderRadius: '0.5rem',
                        backgroundColor: 'var(--color-red-bg)',
                        color: 'var(--color-red)',
                        border: `1px solid var(--color-red)`,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.875rem'
                    }}>
                        <span style={{ fontSize: '1.125rem' }}>⚠️</span>
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AddLecture;