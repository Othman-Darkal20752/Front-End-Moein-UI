// src/pages/Courses.jsx - Light Version
import React, { useState } from 'react';
import CoursesList from '../components/courses/CoursesList';
import CourseModal from '../components/courses/CourseModal';
import AddLectureModal from '../components/courses/AddLectureModal';
import FloatingButton from '../components/forms/FloatingButton';
import { useCourses } from '../hooks/useCourses';

const Courses = ({ pendingOpenCreate, clearPendingOpenCreate, pendingRefresh, clearPendingRefresh }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCourseForLecture, setSelectedCourseForLecture] = useState(null);
  const [showAddLectureModal, setShowAddLectureModal] = useState(false);

  const {
    courses,
    loading,
    error,
    message,
    loadCourses,
    handleCreateCourse,
    setError,
    setMessage,
  } = useCourses(pendingRefresh, clearPendingRefresh);

  // Handle course creation
  const handleCreate = async (values) => {
    const result = await handleCreateCourse(values);
    if (result.success) {
      setShowCreateModal(false);
    }
  };

  // Handle lecture addition
  const handleAddLectureClick = (course) => {
    setSelectedCourseForLecture(course);
    setShowAddLectureModal(true);
  };

  const handleLectureAdded = () => {
    setShowAddLectureModal(false);
    setSelectedCourseForLecture(null);
    setMessage('Added lecture successfully ✓');
    setTimeout(() => setMessage(null), 2000);
  };

  // Auto-open create modal if pendingOpenCreate is true
  React.useEffect(() => {
    if (pendingOpenCreate && clearPendingOpenCreate) {
      setShowCreateModal(true);
      clearPendingOpenCreate();
    }
  }, [pendingOpenCreate, clearPendingOpenCreate]);

  return (
    <div style={{ paddingBottom: '4rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)', fontWeight: 'bold', color: 'var(--color-text-primary)', marginBottom: '0.5rem' }}>
          Available Courses
        </h1>
      </div>

      {/* Courses List */}
      <CoursesList
        courses={courses}
        onAddLecture={handleAddLectureClick}
        loading={loading}
        error={error}
        message={message}
      />

      {/* Floating Action Button */}
      <FloatingButton
        onClick={() => setShowCreateModal(true)}
        title="Create New Course"
      />

      {/* Create Course Modal */}
      {showCreateModal && (
        <CourseModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreate}
        />
      )}

      {/* Add Lecture Modal */}
      {showAddLectureModal && selectedCourseForLecture && (
        <AddLectureModal
          courseId={selectedCourseForLecture.id}
          courseName={selectedCourseForLecture.name}
          isOpen={showAddLectureModal}
          onClose={() => {
            setShowAddLectureModal(false);
            setSelectedCourseForLecture(null);
          }}
          onSuccess={handleLectureAdded}
        />
      )}
    </div>
  );
};

export default Courses;