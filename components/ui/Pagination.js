import React from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePrevPage = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  const handlePageClick = (pageNumber) => {
    if (pageNumber !== currentPage) onPageChange(pageNumber);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const range = 1; // Number of pages before and after the current page to display on small screens
    const isMobile = window.innerWidth < 768;

    // Always show the first page
    pageNumbers.push(
      <button
        key={1}
        className={`w-10 h-10 flex items-center justify-center rounded-md transition-colors duration-300 ${
          currentPage === 1
            ? "bg-custom-dark-blue text-custom-yellow dark:bg-custom-yellow dark:text-custom-dark-blue"
            : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700"
        }`}
        onClick={() => handlePageClick(1)}
      >
        1
      </button>
    );

    // Add ellipsis if not on mobile and there's a gap
    if (!isMobile && currentPage > range + 2) {
      pageNumbers.push(
        <span
          key="ellipsis-start"
          className="mx-2 text-gray-500 dark:text-gray-400"
        >
          ...
        </span>
      );
    }

    // Show pages around the current page
    const start = Math.max(currentPage - range, 2); // Ensure we don't go below page 2
    const end = Math.min(currentPage + range, totalPages - 1); // Ensure we don't go beyond the last page

    for (let i = start; i <= end; i++) {
      pageNumbers.push(
        <button
          key={i}
          className={`mx-1 w-10 h-10 flex items-center justify-center rounded-md transition-colors duration-300 ${
            currentPage === i
              ? "bg-custom-dark-blue text-custom-yellow dark:bg-custom-yellow dark:text-custom-dark-blue"
              : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700"
          }`}
          onClick={() => handlePageClick(i)}
        >
          {i}
        </button>
      );
    }

    // Add ellipsis if not on mobile and there's a gap
    if (!isMobile && currentPage < totalPages - range - 1) {
      pageNumbers.push(
        <span
          key="ellipsis-end"
          className="mx-2 text-gray-500 dark:text-gray-400"
        >
          ...
        </span>
      );
    }

    // Always show the last page
    if (totalPages > 1) {
      pageNumbers.push(
        <button
          key={totalPages}
          className={`mx-1 w-10 h-10 flex items-center justify-center rounded-md transition-colors duration-300 ${
            currentPage === totalPages
              ? "bg-custom-dark-blue text-custom-yellow dark:bg-custom-yellow dark:text-custom-dark-blue"
              : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700"
          }`}
          onClick={() => handlePageClick(totalPages)}
        >
          {totalPages}
        </button>
      );
    }

    return pageNumbers;
  };

  return (
    <div className="flex justify-center items-center space-x-2 my-8 overflow-x-auto z-10">
      <button
        className={`w-10 h-10 flex items-center justify-center rounded-md transition-colors duration-300 z-10 ${
          currentPage === 1
            ? "text-gray-400 dark:text-gray-600 cursor-not-allowed"
            : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700"
        }`}
        disabled={currentPage === 1}
        onClick={handlePrevPage}
      >
        <FiChevronLeft className="text-xl" />
      </button>

      <div className="flex items-center space-x-2 overflow-x-auto">
        {renderPageNumbers()}
      </div>

      <button
        className={`w-10 h-10 flex items-center justify-center rounded-md transition-colors duration-300 z-10 ${
          currentPage === totalPages
            ? "text-gray-400 dark:text-gray-600 cursor-not-allowed"
            : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700"
        }`}
        disabled={currentPage === totalPages}
        onClick={handleNextPage}
      >
        <FiChevronRight className="text-xl" />
      </button>
    </div>
  );
};

export default Pagination;
