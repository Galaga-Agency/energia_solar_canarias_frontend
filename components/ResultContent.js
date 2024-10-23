import React from "react";
import PrimaryButton from "./PrimaryButton";

const ResultContent = ({
  isSubmitting,
  submissionResult,
  tokenInput,
  setTokenInput,
  handleTokenSubmit,
}) => {
  if (isSubmitting) {
    return (
      <div className="text-center">
        <span className="loading loading-spinner"></span>
        <p>Loading...</p>
      </div>
    );
  }

  if (submissionResult?.status === "loginSuccess") {
    return (
      <div className="space-y-4">
        <h2 className="text-gray-800 dark:text-gray-200 text-2xl text-center">
          Enter Code
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-center">
          A code was sent to your email.
        </p>
        <input
          type="text"
          value={tokenInput}
          onChange={(e) => setTokenInput(e.target.value)}
          placeholder="Enter your code"
          className="w-full px-4 py-2 border rounded-md dark:text-black"
        />
        <PrimaryButton onClick={handleTokenSubmit}>Validate Code</PrimaryButton>
      </div>
    );
  }

  if (submissionResult?.status === "loginError") {
    return (
      <div className="text-center text-red-500">
        <p>{submissionResult.message}</p>
        <button className="text-gray-800 dark:text-gray-200 underline mt-4">
          Back to Login
        </button>
      </div>
    );
  }

  return null;
};

export default ResultContent;
