import { Formik, Form } from 'formik';
import { useNavigate } from 'react-router-dom';
import { signupUser } from '../api';
import { singupValues } from '../constants/values';
import { SignUpSchema } from '../constants/validation';
import InputField from '../components/forms/InputField';

const SignUp = () => {
    const navigate = useNavigate();

    const onSubmit = async (values, { setSubmitting }) => {
        // include confirmPassword in the payload so backend receives it as well
        try {
            const res = await signupUser(values);
            console.log('Signup success:', res.data);
        } catch (err) {
            console.error('Signup failed:', err);
        }
        setSubmitting(false);
    }

    return (
        <div id='signup' style={{ maxWidth: '500px', margin: '0 auto', padding: '2rem' }}>
            <h2>Sign Up</h2>
            <Formik
                initialValues={singupValues}
                validationSchema={SignUpSchema}
                onSubmit={onSubmit}
            >
                {({ isSubmitting }) => (
                    <Form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {/* Form Fields Container */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <InputField name="username" placeholder="Username" label="Username" />
                            <InputField name="email" placeholder="Email" label="Email" type="email" />
                            <InputField name="phone" placeholder="Phone" label="Phone" type="text" />
                            <InputField name="password" placeholder="Password" label="Password" type="password" />
                            <InputField name="password_confirm" placeholder="Confirm Password" label="Confirm Password" type="password" />
                        </div>

                        {/* Action Buttons */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
                            <button type="submit" className="btn btn-primary btn-full" disabled={isSubmitting}>
                                Sign Up
                            </button>
                            <button type="button" className="btn btn-ghost btn-full" onClick={() => navigate('/')}>
                                Back to Login
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default SignUp;
