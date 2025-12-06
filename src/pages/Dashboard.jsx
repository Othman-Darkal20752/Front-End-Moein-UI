import React from 'react';

const Dashboard = ({ onCreateCourse, onLoadCourses }) => {
  return (
    <div id="dashboard" style={{ width: '100%', maxWidth: 920 }}>
      <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Dashboard</h2>
      <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>Welcome to your dashboard. From here you can manage courses and lectures.</p>

      <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <button className="btn btn-primary" onClick={() => onCreateCourse && onCreateCourse()}>
          Create Course
        </button>
        <button className="btn btn-ghost" onClick={() => onLoadCourses && onLoadCourses()}>
          Load Courses
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
