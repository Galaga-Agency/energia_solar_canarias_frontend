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
    const maxPagesToShow = 3; // Total number of pages to display (including ellipses)
    const range = 2; // Number of pages before and after the current page to display

    // Always show the first page
    pageNumbers.push(
      <button
        key={1}
        className={`mx-1 px-4 py-2 rounded-full border transition-colors duration-300 z-30 ${
          currentPage === 1
            ? "bg-custom-yellow text-black"
            : "bg-custom-dark-blue text-white hover:bg-custom-yellow hover:text-black"
        }`}
        onClick={() => handlePageClick(1)}
      >
        1
      </button>
    );

    // Add ellipsis if there's a gap between the first page and the current page
    if (currentPage > range + 2) {
      pageNumbers.push(
        <span key="ellipsis-start" className="mx-1 text-white">
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
          className={`mx-1 px-4 py-2 rounded-full border transition-colors duration-300 z-30 ${
            currentPage === i
              ? "bg-custom-yellow text-black"
              : "bg-custom-dark-blue text-white hover:bg-custom-yellow hover:text-black"
          }`}
          onClick={() => handlePageClick(i)}
        >
          {i}
        </button>
      );
    }

    // Add ellipsis if there's a gap between the last visible page and the last page
    if (currentPage < totalPages - range - 1) {
      pageNumbers.push(
        <span key="ellipsis-end" className="mx-1 text-white">
          ...
        </span>
      );
    }

    // Always show the last page
    if (totalPages > 1) {
      pageNumbers.push(
        <button
          key={totalPages}
          className={`mx-1 px-4 py-2 rounded-full border transition-colors duration-300 z-30 ${
            currentPage === totalPages
              ? "bg-custom-yellow text-black"
              : "bg-custom-dark-blue text-white hover:bg-custom-yellow hover:text-black"
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
    <div className="flex justify-center items-center space-x-2 mb-12 2xl:mb-0">
      <button
        className={`p-2 rounded-full border transition-all duration-300 z-30 ${
          currentPage === 1
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-custom-yellow hover:text-black text-white bg-custom-dark-blue"
        }`}
        disabled={currentPage === 1}
        onClick={handlePrevPage}
      >
        <FiChevronLeft className="text-xl dark:text-custom-yellow z-30" />
      </button>

      {renderPageNumbers()}

      <button
        className={`p-2 rounded-full border transition-all duration-300 z-30 ${
          currentPage === totalPages
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-custom-yellow hover:text-black text-white bg-custom-dark-blue"
        }`}
        disabled={currentPage === totalPages}
        onClick={handleNextPage}
      >
        <FiChevronRight className="text-xl dark:text-custom-yellow" />
      </button>
    </div>
  );
};

export default Pagination;
