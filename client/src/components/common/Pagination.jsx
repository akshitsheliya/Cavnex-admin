import React from "react";
import { PAGINATION } from "../../config/constants";

const Pagination = ({
  page,
  totalPages,
  totalItems,
  limit,
  onPageChange,
  onLimitChange,
  showLimitSelector = true,
  showInfo = true,
  className = "",
}) => {
  const startIndex = (page - 1) * limit + 1;
  const endIndex = Math.min(page * limit, totalItems);

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages = [];
    const showPages = 5;
    let start = Math.max(1, page - Math.floor(showPages / 2));
    let end = Math.min(totalPages, start + showPages - 1);

    if (end - start + 1 < showPages) {
      start = Math.max(1, end - showPages + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}
    >
      {/* Info */}
      {showInfo && (
        <p className="text-sm text-gray-500">
          Showing {startIndex} to {endIndex} of {totalItems} results
        </p>
      )}

      <div className="flex items-center gap-4">
        {/* Limit Selector */}
        {showLimitSelector && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Show</span>
            <select
              value={limit}
              onChange={(e) => onLimitChange?.(parseInt(e.target.value))}
              className="px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-neon-green/50"
            >
              {PAGINATION.limitOptions.map((option) => (
                <option key={option} value={option} className="bg-gray-900">
                  {option}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Page Navigation */}
        <div className="flex items-center gap-1">
          {/* Previous */}
          <button
            onClick={() => onPageChange?.(page - 1)}
            disabled={page === 1}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {/* First page */}
          {getPageNumbers()[0] > 1 && (
            <>
              <button
                onClick={() => onPageChange?.(1)}
                className="px-3 py-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                1
              </button>
              {getPageNumbers()[0] > 2 && (
                <span className="px-2 text-gray-500">...</span>
              )}
            </>
          )}

          {/* Page numbers */}
          {getPageNumbers().map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => onPageChange?.(pageNum)}
              className={`px-3 py-1 rounded-lg transition-colors ${
                pageNum === page
                  ? "bg-neon-green text-black font-medium"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {pageNum}
            </button>
          ))}

          {/* Last page */}
          {getPageNumbers()[getPageNumbers().length - 1] < totalPages && (
            <>
              {getPageNumbers()[getPageNumbers().length - 1] <
                totalPages - 1 && (
                <span className="px-2 text-gray-500">...</span>
              )}
              <button
                onClick={() => onPageChange?.(totalPages)}
                className="px-3 py-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                {totalPages}
              </button>
            </>
          )}

          {/* Next */}
          <button
            onClick={() => onPageChange?.(page + 1)}
            disabled={page === totalPages}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
