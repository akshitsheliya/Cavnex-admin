import React, { createContext, useContext } from "react";

const FormContext = createContext({});

export const useFormContext = () => useContext(FormContext);

const Form = ({
  children,
  onSubmit,
  errors = {},
  className = "",
  ...props
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(e);
  };

  return (
    <FormContext.Provider value={{ errors }}>
      <form
        onSubmit={handleSubmit}
        className={`space-y-6 ${className}`}
        {...props}
      >
        {children}
      </form>
    </FormContext.Provider>
  );
};

export default Form;
