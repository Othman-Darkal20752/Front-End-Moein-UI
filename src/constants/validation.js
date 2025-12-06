import * as Yup from 'yup';

export const LoginSchema = Yup.object().shape({
  username: Yup.string().required('Username is required').min(2, 'Username must be at most 4 characters'),
  password: Yup.string().required('Password is required').min(6, 'Password must be at most 6 characters'),
});

export const SignUpSchema = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phone: Yup.string()
    .matches(/^[0-9]+$/, 'Phone must be digits only')
    .required('Phone is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  password_confirm: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('password_confirm is required'),
});