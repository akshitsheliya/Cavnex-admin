import * as Yup from 'yup';
import { rules } from '../utils/validators';

// ─── Login ────────────────────────────────────────────────────────────────────

export const loginSchema = Yup.object().shape({
  email: rules.email,
  password: Yup.string().required('Password is required'),
});

// ─── Register ─────────────────────────────────────────────────────────────────

export const registerSchema = Yup.object().shape({
  name: rules.name,
  email: rules.email,
  password: rules.password,
  confirmPassword: rules.confirmPassword('password'),
});
