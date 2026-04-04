import * as Yup from 'yup';

// ─── Reusable Field Rules ────────────────────────────────────────────────────

export const rules = {
  /** Full name: required, min 2 chars, letters/spaces only */
  name: Yup.string()
    .trim()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .matches(/^[A-Za-z\s'-]+$/, 'Name can only contain letters, spaces, hyphens and apostrophes'),

  /** Generic required name without letter-only restriction (business names) */
  requiredText: (label = 'This field') =>
    Yup.string().trim().required(`${label} is required`),

  /** RFC-compliant email */
  email: Yup.string()
    .trim()
    .required('Email is required')
    .email('Please enter a valid email address'),

  /** Optional email */
  emailOptional: Yup.string()
    .trim()
    .email('Please enter a valid email address')
    .notRequired(),

  /** India mobile: starts 6-9, exactly 10 digits */
  phone: Yup.string()
    .trim()
    .required('Phone number is required')
    .matches(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number'),

  /** Optional phone */
  phoneOptional: Yup.string()
    .trim()
    .test('optional-phone', 'Please enter a valid 10-digit Indian mobile number', (val) => {
      if (!val || val === '') return true;
      return /^[6-9]\d{9}$/.test(val);
    }),

  /**
   * Strong password:
   * - min 8 chars
   * - at least 1 uppercase, 1 lowercase, 1 digit, 1 special char
   */
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[!@#$%^&*(),.?":{}|<>_\-+=~`[\]\\;'/]/, 'Password must contain at least one special character'),

  /** Current password (just required, no strength check) */
  currentPassword: Yup.string()
    .required('Current password is required'),

  /** Confirm password — must call .oneOf in the schema using ref */
  confirmPassword: (ref = 'password') =>
    Yup.string()
      .required('Please confirm your password')
      .oneOf([Yup.ref(ref)], 'Passwords do not match'),

  /** Optional URL */
  url: Yup.string()
    .trim()
    .url('Please enter a valid URL (must start with http:// or https://)')
    .notRequired(),

  /** GST number (Indian format) */
  gstNumber: Yup.string()
    .trim()
    .matches(
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
      'Please enter a valid GST number'
    )
    .notRequired(),

  /** Pincode (6-digit Indian) */
  pincode: Yup.string()
    .trim()
    .matches(/^\d{6}$/, 'Please enter a valid 6-digit pincode')
    .notRequired(),

  /** Positive number */
  positiveNumber: (label = 'Value') =>
    Yup.number()
      .typeError(`${label} must be a number`)
      .positive(`${label} must be positive`)
      .required(`${label} is required`),

  /** Non-negative number (0 allowed) */
  nonNegativeNumber: (label = 'Value') =>
    Yup.number()
      .typeError(`${label} must be a number`)
      .min(0, `${label} cannot be negative`)
      .required(`${label} is required`),

  /** Date: required */
  requiredDate: (label = 'Date') =>
    Yup.string().trim().required(`${label} is required`),

  /** Required select / dropdown */
  requiredSelect: (label = 'This field') =>
    Yup.string().trim().required(`${label} is required`),
};

// ─── Helper: run a Yup schema against values and return errors object ─────────

/**
 * Validates values against a Yup schema.
 * Returns { isValid: boolean, errors: Record<string, string> }
 */
export async function validateSchema(schema, values) {
  try {
    await schema.validate(values, { abortEarly: false, stripUnknown: true });
    return { isValid: true, errors: {} };
  } catch (err) {
    if (err.name === 'ValidationError') {
      const errors = {};
      err.inner.forEach((e) => {
        if (e.path && !errors[e.path]) {
          errors[e.path] = e.message;
        }
      });
      return { isValid: false, errors };
    }
    throw err;
  }
}

/**
 * Validates a single field against a Yup schema.
 * Returns error string or empty string.
 */
export async function validateField(schema, fieldName, value, allValues = {}) {
  try {
    await schema.validateAt(fieldName, { ...allValues, [fieldName]: value });
    return '';
  } catch (err) {
    return err.message || 'Invalid value';
  }
}
