// src/components/courses/CourseModal.jsx
import React from 'react';
import { Formik, Form } from 'formik';
import InputField from '../forms/InputField';

const CourseModal = ({ isOpen, onClose, onSubmit }) => {
  if (!isOpen) return null;

  const initialValues = { course_name: '', course_teacher: '' };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    await onSubmit(values);
    setSubmitting(false);
    resetForm();
  };

  return (
    <div className="modal-overlay">
      <div className="modal" style={{ maxWidth: '28rem' }}>
        {/* Modal Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: '600', color: 'var(--color-text-primary)' }}>
              Create New Course
            </h3>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-text-secondary)',
                cursor: 'pointer',
                fontSize: '1.25rem',
                padding: 0
              }}
            >
              <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <p style={{ marginTop: '0.25rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
            Enter the details for the new course below.
          </p>
        </div>

        {/* Modal Form */}
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="input-field">
                  <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-primary)' }}>
                    Course Name
                  </label>
                  <input
                    name="course_name"
                    type="text"
                    placeholder="ex. Intro to Programming"
                    className="form-input"
                    required
                  />
                </div>

                <div className="input-field">
                  <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-primary)' }}>
                    Teacher Name
                  </label>
                  <input
                    name="course_teacher"
                    type="text"
                    placeholder="ex. Mohamed"
                    className="form-input"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="modal-footer">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn btn-ghost"
                >
                  Cancel
                </button>
                
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  {isSubmitting ? 'Creating...' : 'Create Course'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default CourseModal;