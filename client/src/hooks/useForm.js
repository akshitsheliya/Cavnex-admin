import { useState } from "react";

const useForm = (initialValues = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const setValue = (name, value) => {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
  };

  const setFormErrors = (errorObj) => {
    setErrors(errorObj);
  };

  return {
    values,
    errors,
    handleChange,
    setValue,
    reset,
    setValues,
    setFormErrors,
  };
};

export default useForm;
