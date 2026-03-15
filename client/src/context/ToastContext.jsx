import React, { createContext, useContext } from "react";
import toast from "react-hot-toast";

const ToastContext = createContext({});

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const showToast = {
    success: (message) => toast.success(message),
    error: (message) => toast.error(message),
    loading: (message) => toast.loading(message),
    promise: (promise, messages) => toast.promise(promise, messages),
    dismiss: (id) => toast.dismiss(id),
    custom: (component) => toast.custom(component),
  };

  return (
    <ToastContext.Provider value={showToast}>{children}</ToastContext.Provider>
  );
};

export default ToastContext;
