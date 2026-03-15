import { useState, useCallback, useRef, useEffect } from "react";
import ErrorHandler from "../services/errorHandler";

/**
 * Custom hook for API calls with loading, error, and data states
 */
export const useApi = (apiFunction, options = {}) => {
  const {
    immediate = false,
    initialData = null,
    onSuccess,
    onError,
    showErrorToast = true,
  } = options;

  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  // Track mounted state to prevent state updates on unmounted component
  const mountedRef = useRef(true);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      abortControllerRef.current?.abort();
    };
  }, []);

  const execute = useCallback(
    async (...args) => {
      try {
        // Cancel previous request
        abortControllerRef.current?.abort();
        abortControllerRef.current = new AbortController();

        setLoading(true);
        setError(null);

        const result = await apiFunction(...args);

        if (mountedRef.current) {
          setData(result.data || result);
          setLoading(false);
          onSuccess?.(result);
        }

        return result;
      } catch (err) {
        if (mountedRef.current) {
          const handledError = ErrorHandler.handle(err, {
            showToast: showErrorToast,
          });
          setError(handledError);
          setLoading(false);
          onError?.(handledError);
        }
        throw err;
      }
    },
    [apiFunction, onSuccess, onError, showErrorToast]
  );

  const reset = useCallback(() => {
    setData(initialData);
    setError(null);
    setLoading(false);
  }, [initialData]);

  // Execute immediately if specified
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute]);

  return {
    data,
    loading,
    error,
    execute,
    reset,
    setData,
  };
};

/**
 * Hook for mutation operations (POST, PUT, DELETE)
 */
export const useMutation = (mutationFn, options = {}) => {
  const {
    onSuccess,
    onError,
    successMessage,
    showSuccessToast = true,
    showErrorToast = true,
  } = options;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = useCallback(
    async (...args) => {
      try {
        setLoading(true);
        setError(null);

        const result = await mutationFn(...args);

        if (showSuccessToast && successMessage) {
          const { toast } = await import("react-hot-toast");
          toast.success(successMessage);
        }

        onSuccess?.(result);
        return result;
      } catch (err) {
        const handledError = ErrorHandler.handle(err, {
          showToast: showErrorToast,
        });
        setError(handledError);
        onError?.(handledError);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [
      mutationFn,
      onSuccess,
      onError,
      successMessage,
      showSuccessToast,
      showErrorToast,
    ]
  );

  const reset = useCallback(() => {
    setError(null);
    setLoading(false);
  }, []);

  return {
    mutate,
    loading,
    error,
    reset,
  };
};

export default useApi;
