// src/components/courses/CoursesList.jsx
import React from 'react';
import CourseCard from './CourseCard';

const CoursesList = ({ 
  courses, 
  onAddLecture, 
  loading, 
  error, 
  message 
}) => {
  if (loading && courses.length === 0) {
    return (
      <div style={{ textAlign: 'center', paddingTop: '3rem', paddingBottom: '3rem' }}>
        <div style={{ display: 'inline-block', animation: 'spin 1s linear infinite', borderRadius: '50%', width: '2rem', height: '2rem', borderTop: '2px solid var(--color-blue)', borderBottom: '2px solid var(--color-blue)', marginBottom: '1rem' }}></div>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>Loading courses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        backgroundColor: 'var(--color-red-bg)',
        border: `1px solid var(--color-red)`,
        borderRadius: '0.5rem',
        padding: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ flexShrink: 0 }}>
            <svg style={{ width: '1.25rem', height: '1.25rem', color: 'var(--color-red)' }} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div style={{ marginLeft: '0.75rem' }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--color-red)', marginBottom: 0 }}>Error loading courses</h3>
            <p style={{ marginTop: '0.25rem', fontSize: '0.875rem', color: 'var(--color-red)' }}>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        paddingTop: '3rem',
        paddingBottom: '3rem',
        border: '2px dashed var(--color-border)',
        borderRadius: '0.5rem'
      }}>
        <svg style={{ width: '3rem', height: '3rem', color: 'var(--color-text-muted)', margin: '0 auto' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 14l9-5-9-5-9 5 9 5z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 14l9-5-9-5-9 5 9 5z" opacity="0.5" />
        </svg>
        <h3 style={{ marginTop: '1rem', fontSize: '0.875rem', fontWeight: '500', color: 'var(--color-text-primary)' }}>No courses yet</h3>
        <p style={{ marginTop: '0.25rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Create your first course to get started</p>
      </div>
    );
  }

  return (
    <>
      {message && (
        <div style={{
          marginBottom: '1rem',
          padding: '0.75rem',
          borderRadius: '0.5rem',
          border: `1px solid ${message.includes('✓') ? 'var(--color-green)' : 'var(--color-blue)'}`,
          backgroundColor: message.includes('✓') ? 'var(--color-green-bg)' : 'var(--color-blue-bg)',
          color: message.includes('✓') ? 'var(--color-green)' : 'var(--color-blue)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '0.5rem' }}>{message.includes('✓') ? '✓' : 'ℹ️'}</span>
            <span style={{ fontSize: '0.875rem' }}>{message}</span>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
        {courses.map((course, idx) => {
          if (!course) return null;
          const key = course.id ?? `${course.name}-${idx}`;
          return (
            <CourseCard
              key={key}
              course={course}
              onAddLecture={onAddLecture}
            />
          );
        })}
      </div>
    </>
  );
};

export default CoursesList;