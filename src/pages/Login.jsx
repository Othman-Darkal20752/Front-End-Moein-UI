import React from 'react';
import { Formik, Form } from 'formik';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api';
import { LoginSchema } from '../constants/validation';
import { loginValues } from '../constants/values';
import { extractToken } from '../utils/apiHelpers';
import { useAuth } from '../contexts/AuthContext';
import InputField from '../components/forms/InputField';
import Alert from '../components/ui/Alert';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = React.useState(null);

  const onSubmit = async (values, formik) => {
    setError(null);
    try {
      const res = await loginUser(values);
      const token = extractToken(res);

      if (token) {
        login(token);
        setTimeout(() => navigate('/dashboard'), 300);
      } else {
        setError('No token received from server');
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    }
    formik.setSubmitting(false);
  };

  return (
    <div id="login" style={{ maxWidth: '500px', margin: '0 auto', padding: '2rem' }}>
      <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Login</h2>

      {error && (
        <Alert type="error" message={error} onDismiss={() => setError(null)} />
      )}

      <Formik
        initialValues={loginValues}
        validationSchema={LoginSchema}
        onSubmit={onSubmit}
        validateOnMount={true}
      >
        {({ isSubmitting, isValid }) => (
          <Form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Form Fields Container */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <InputField
                name="username"
                placeholder="Enter username"
                label="Username"
                type="text"
              />
              <InputField
                name="password"
                placeholder="Enter password"
                label="Password"
                type="password"
              />
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
              <button
                type="submit"
                disabled={isSubmitting || !isValid}
                className="btn btn-primary btn-full"
              >
                {isSubmitting ? 'Logging in...' : 'Login'}
              </button>
            </div>

            {/* Sign Up Link */}
            <div style={{ textAlign: 'center', fontSize: '0.875rem', marginTop: '1rem' }}>
              <span style={{ color: 'var(--color-text-secondary)' }}>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/register')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-blue)',
                    cursor: 'pointer',
                    fontWeight: '500',
                    textDecoration: 'none',
                    transition: 'color 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.color = 'var(--color-blue-light)'}
                  onMouseLeave={(e) => e.target.style.color = 'var(--color-blue)'}
                >
                  Sign Up
                </button>
              </span>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Login;
