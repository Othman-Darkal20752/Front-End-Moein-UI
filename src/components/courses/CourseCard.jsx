// src/components/courses/CourseCard.jsx
import React from 'react';

const CourseCard = ({ course, onAddLecture }) => {
  if (!course) return null;

  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2) || 'CO';
  };

  const colors = [
    { bg: 'var(--color-blue-bg)', text: 'var(--color-blue)' },
    { bg: 'var(--color-green-bg)', text: 'var(--color-green)' },
    { bg: 'var(--color-purple-bg)', text: 'var(--color-purple)' },
    { bg: 'var(--color-yellow-bg)', text: 'var(--color-yellow)' },
    { bg: 'var(--color-red-bg)', text: 'var(--color-red)' }
  ];

  const colorIndex = Math.abs(course.id?.toString().hashCode?.() || 0) % colors.length;
  const colorStyle = colors[colorIndex];

  return (
    <div style={{
      backgroundColor: 'var(--color-bg-primary)',
      border: '1px solid var(--color-border)',
      borderRadius: '0.5rem',
      padding: '1.25rem',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
      transition: 'box-shadow 0.2s ease'
    }}
    onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)'}
    onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)'}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{
            width: '2.5rem',
            height: '2.5rem',
            borderRadius: '0.5rem',
            backgroundColor: colorStyle.bg,
            color: colorStyle.text,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: '0.875rem',
            marginRight: '0.75rem'
          }}>
            {getInitials(course.name)}
          </div>
          <div>
            <h3 style={{
              fontWeight: '600',
              color: 'var(--color-text-primary)',
              transition: 'color 0.2s ease',
              margin: 0,
              marginBottom: '0.25rem'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-blue)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-primary)'}
            >
              {course.name || 'Unnamed Course'}
            </h3>
            <p style={{
              fontSize: '0.875rem',
              color: 'var(--color-text-secondary)',
              marginTop: '0.25rem',
              margin: 0
            }}>
              {course.course_teacher || 'No teacher assigned'}
            </p>
          </div>
        </div>
        
        {course.__optimistic && (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            paddingLeft: '0.5rem',
            paddingRight: '0.5rem',
            paddingTop: '0.25rem',
            paddingBottom: '0.25rem',
            borderRadius: '0.25rem',
            fontSize: '0.75rem',
            fontWeight: '500',
            backgroundColor: 'var(--color-yellow-bg)',
            color: 'var(--color-yellow)'
          }}>
            Course is being created...
          </span>
        )}
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: '1.5rem',
        paddingTop: '1rem',
        borderTop: '1px solid var(--color-border-muted)'
      }}>
        <div style={{
          fontSize: '0.75rem',
          color: 'var(--color-text-secondary)'
        }}>
          {course.id ? `ID: ${course.id}` : 'Temporary'}
        </div>
        
        <button
          onClick={() => onAddLecture(course)}
          className="btn btn-sm"
          style={{
            backgroundColor: 'var(--color-blue-bg)',
            color: 'var(--color-blue)',
            border: `1px solid var(--color-blue)`
          }}
        >
          Add Lecture +
        </button>
      </div>
    </div>
  );
};

// Helper function for consistent hashing
String.prototype.hashCode = function() {
  let hash = 0;
  for (let i = 0; i < this.length; i++) {
    const char = this.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

export default CourseCard;