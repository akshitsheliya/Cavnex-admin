import { useState, useMemo, useCallback } from "react";
import { PAGINATION } from "../config/constants";

/**
 * Hook for handling pagination state and logic
 */
export const usePagination = (options = {}) => {
  const {
    initialPage = PAGINATION.defaultPage,
    initialLimit = PAGINATION.defaultLimit,
    total = 0,
  } = options;

  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [totalItems, setTotalItems] = useState(total);

  // Calculate pagination values
  const pagination = useMemo(() => {
    const totalPages = Math.ceil(totalItems / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;
    const startIndex = (page - 1) * limit + 1;
    const endIndex = Math.min(page * limit, totalItems);

    return {
      page,
      limit,
      totalItems,
      totalPages,
      hasNextPage,
      hasPrevPage,
      startIndex,
      endIndex,
    };
  }, [page, limit, totalItems]);

  // Navigation functions
  const nextPage = useCallback(() => {
    if (pagination.hasNextPage) {
      setPage((prev) => prev + 1);
    }
  }, [pagination.hasNextPage]);

  const prevPage = useCallback(() => {
    if (pagination.hasPrevPage) {
      setPage((prev) => prev - 1);
    }
  }, [pagination.hasPrevPage]);

  const goToPage = useCallback(
    (newPage) => {
      const validPage = Math.max(1, Math.min(newPage, pagination.totalPages));
      setPage(validPage);
    },
    [pagination.totalPages]
  );

  const changeLimit = useCallback((newLimit) => {
    setLimit(newLimit);
    setPage(1); // Reset to first page when changing limit
  }, []);

  const reset = useCallback(() => {
    setPage(initialPage);
    setLimit(initialLimit);
  }, [initialPage, initialLimit]);

  // Update total items (usually from API response)
  const updateTotal = useCallback(
    (newTotal) => {
      setTotalItems(newTotal);
      // Adjust current page if it exceeds new total pages
      const newTotalPages = Math.ceil(newTotal / limit);
      if (page > newTotalPages && newTotalPages > 0) {
        setPage(newTotalPages);
      }
    },
    [limit, page]
  );

  // Get params for API request
  const getApiParams = useCallback(
    () => ({
      page,
      limit,
    }),
    [page, limit]
  );

  return {
    ...pagination,
    setPage,
    setLimit,
    nextPage,
    prevPage,
    goToPage,
    changeLimit,
    reset,
    updateTotal,
    getApiParams,
  };
};

export default usePagination;
