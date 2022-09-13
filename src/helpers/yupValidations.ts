import * as yup from 'yup'

export const trapStatusSchema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email Required'),
  password: yup
    .string()
    .required('Password Required')
    .min(6, 'Password must be at least 6 characters'),
})
