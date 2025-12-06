import React from 'react';
import { Formik, Form } from 'formik';
import InputField from './InputField';

const CourseForm = ({ initial = { course_name: '', course_teacher: '' }, onSubmit, onCancel }) => {
  return (
    <Formik
      initialValues={initial}
      onSubmit={async (values, actions) => {
        await onSubmit(values, actions);
        actions.setSubmitting(false);
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <InputField name="course_name" label="" placeholder="e.g. Intro to React" />
          <InputField name="course_teacher" label="course_teacher" placeholder="course_teacher" />

          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Creating…' : 'Create'}
            </button>
            <button type="button" className="btn" onClick={onCancel} disabled={isSubmitting}>Cancel</button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default CourseForm;
