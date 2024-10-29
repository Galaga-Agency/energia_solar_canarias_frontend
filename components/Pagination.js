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
    for (let i = 1; i <= totalPages; i++) {
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
    return pageNumbers;
  };

  return (
    <div className="flex justify-center items-center space-x-2 mb-20 2xl:mb-0 z-30">
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
