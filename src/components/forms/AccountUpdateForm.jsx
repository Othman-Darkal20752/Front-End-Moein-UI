// src/components/forms/AccountUpdateForm.jsx - FIXED THEME
import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  name: Yup.string().required("username required"),
  email: Yup.string().email("Email incorrect").required("Email is required"),
  phone: Yup.string()
    .matches(/^[0-9]+$/, "Phone number must contain only digits")
    .required("Phone number is required"),
  password: Yup.string().min(6, "the password is too short - should be 6 chars minimum"),
  confirmPassword: Yup.string().oneOf(
    [Yup.ref("password"), null],
    "the passwords don't match"
  ),
});

const AccountUpdateForm = ({ 
  initialValues, 
  onSubmit, 
  isSubmitting, 
  onReset,
  userData 
}) => {
  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ isValid, dirty, resetForm }) => (
        <Form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Form Fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Username */}
            <div className="input-field">
              <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-primary)' }}>
              username
              </label>
              <Field
                name="name"
                type="text"
                placeholder="username"
                className="form-input"
              />
              <ErrorMessage name="name" component="div" className="error-message" />
            </div>

            {/* Email */}
            <div className="input-field">
              <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-primary)' }}>
              Email
              </label>
              <Field
                name="email"
                type="email"
                placeholder="you@example.com"
                className="form-input"
              />
              <ErrorMessage name="email" component="div" className="error-message" />
            </div>

            {/* Phone */}
            <div className="input-field">
              <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-primary)' }}>
              Phone Number
              </label>
              <Field
                name="phone"
                type="text"
                placeholder="09123456789"
                className="form-input"
              />
              <ErrorMessage name="phone" component="div" className="error-message" />
            </div>

            {/* Password Fields Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
              {/* New Password */}
              <div className="input-field">
                <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-primary)' }}>
                New Password
                </label>
                <Field
                  name="password"
                  type="password"
                  placeholder="New Password"
                  className="form-input"
                />
                <ErrorMessage name="password" component="div" className="error-message" />
              </div>

              {/* Confirm Password */}
              <div className="input-field">
                <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-primary)' }}>
                Confirm Password 
                </label>
                <Field
                  name="confirmPassword"
                  type="password"
                  placeholder="confirm new password"
                  className="form-input"
                />
                <ErrorMessage name="confirmPassword" component="div" className="error-message" />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ paddingTop: '1.5rem', borderTop: '1px solid var(--color-border)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button
                type="submit"
                disabled={isSubmitting || !isValid || !dirty}
                className="btn btn-primary btn-full"
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>

              <button
                type="button"
                onClick={() => {
                  resetForm();
                  if (onReset) onReset();
                }}
                className="btn btn-ghost btn-full"
              >
                Reset
              </button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default AccountUpdateForm;