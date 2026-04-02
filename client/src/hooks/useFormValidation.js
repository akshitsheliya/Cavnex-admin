import { useState, useCallback } from 'react';
import { validateSchema, validateField } from '../utils/validators';

/**
 * useFormValidation
 *
 * Enhances the existing form pattern with Yup schema validation.
 * Fully preserves existing useState logic — just adds validate() on top.
 *
 * @param {object}   initialValues  - Initial form state (same as useForm)
 * @param {Yup.Schema} schema       - Yup validation schema for this form
 *
 * @returns {object}
 *   - values, errors, touched
 *   - handleChange(e)              - onChange handler (clears field error)
 *   - handleBlur(e)                - onBlur handler (validates single field)
 *   - handleNestedChange(parent, field, value) - for nested objects
 *   - setFieldValue(name, value)
 *   - setValues(fn | obj)
 *   - setFormErrors(obj)
 *   - reset()
 *   - validate()                   - async, validates all, returns isValid
 *   - isSubmitDisabled(loading)    - true when form has been touched and is invalid
 */
const useFormValidation = (initialValues = {}, schema = null) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // ── Helpers ──────────────────────────────────────────────────────────────

  /** Generic handleChange — works for flat fields */
  const handleChange = useCallback(
    (e) => {
      const { name, value, type, checked } = e.target;
      const newValue = type === 'checkbox' ? checked : value;

      setValues((prev) => ({ ...prev, [name]: newValue }));

      // Clear error on change
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: '' }));
      }
    },
    [errors]
  );

  /** handleBlur — validates a single field */
  const handleBlur = useCallback(
    async (e) => {
      const { name } = e.target;
      setTouched((prev) => ({ ...prev, [name]: true }));

      if (!schema) return;

      const fieldError = await validateField(schema, name, values[name], values);
      setErrors((prev) => ({ ...prev, [name]: fieldError }));
    },
    [schema, values]
  );

  /** handleNestedChange — for nested objects like address.city */
  const handleNestedChange = useCallback(
    (parent, field, value) => {
      setValues((prev) => ({
        ...prev,
        [parent]: { ...prev[parent], [field]: value },
      }));
      // Clear nested error key e.g. "address.city"
      const key = `${parent}.${field}`;
      if (errors[key]) {
        setErrors((prev) => ({ ...prev, [key]: '' }));
      }
    },
    [errors]
  );

  /** Change handler for nested fields passed via dot-notation name (e.g. name="address.city") */
  const handleDotNotationChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      if (name.includes('.')) {
        const [parent, child] = name.split('.');
        handleNestedChange(parent, child, value);
      } else {
        handleChange(e);
      }
    },
    [handleChange, handleNestedChange]
  );

  /** Set a single field value programmatically */
  const setFieldValue = useCallback((name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  /** Override all form errors (e.g. from API) */
  const setFormErrors = useCallback((errorObj) => {
    setErrors(errorObj);
  }, []);

  /** Reset form to initial values */
  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  /**
   * validate() — validates entire form against schema.
   * Marks all fields as touched.
   * Populates errors state.
   * Returns boolean isValid.
   */
  const validate = useCallback(async () => {
    if (!schema) return true;

    const { isValid, errors: newErrors } = await validateSchema(schema, values);

    // Mark all fields touched
    const allTouched = Object.keys(values).reduce((acc, k) => {
      acc[k] = true;
      return acc;
    }, {});
    setTouched(allTouched);
    setErrors(newErrors);

    return isValid;
  }, [schema, values]);

  /**
   * isSubmitDisabled — returns true if form has errors (after first submission attempt).
   * Pass loading state to also disable during API call.
   */
  const isSubmitDisabled = useCallback(
    (loading = false) => {
      if (loading) return true;
      const hasErrors = Object.values(errors).some(Boolean);
      return hasErrors;
    },
    [errors]
  );

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleNestedChange,
    handleDotNotationChange,
    setFieldValue,
    setValues,
    setFormErrors,
    reset,
    validate,
    isSubmitDisabled,
  };
};

export default useFormValidation;
