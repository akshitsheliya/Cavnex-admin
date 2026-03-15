import { useState, useCallback } from "react";

/**
 * Hook for managing modal state
 */
export const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);
  const [data, setData] = useState(null);

  const open = useCallback((modalData = null) => {
    setData(modalData);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    // Clear data after animation
    setTimeout(() => setData(null), 200);
  }, []);

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return {
    isOpen,
    data,
    open,
    close,
    toggle,
  };
};

/**
 * Hook for managing multiple modals
 */
export const useModals = () => {
  const [modals, setModals] = useState({});

  const open = useCallback((modalId, data = null) => {
    setModals((prev) => ({
      ...prev,
      [modalId]: { isOpen: true, data },
    }));
  }, []);

  const close = useCallback((modalId) => {
    setModals((prev) => ({
      ...prev,
      [modalId]: { isOpen: false, data: null },
    }));
  }, []);

  const closeAll = useCallback(() => {
    setModals({});
  }, []);

  const isOpen = useCallback(
    (modalId) => {
      return modals[modalId]?.isOpen || false;
    },
    [modals]
  );

  const getData = useCallback(
    (modalId) => {
      return modals[modalId]?.data || null;
    },
    [modals]
  );

  return {
    modals,
    open,
    close,
    closeAll,
    isOpen,
    getData,
  };
};

export default useModal;
