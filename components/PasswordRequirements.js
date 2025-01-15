import React, { useState } from "react";
import { Check, X } from "lucide-react";

const PasswordRequirements = ({ password = "" }) => {
  const requirements = {
    minLength: {
      test: (pass) => pass.length >= 8,
      message: "Must be at least 8 characters",
    },
    hasUppercase: {
      test: (pass) => /[A-Z]/.test(pass),
      message: "Must contain uppercase letter",
    },
    hasLowercase: {
      test: (pass) => /[a-z]/.test(pass),
      message: "Must contain lowercase letter",
    },
    hasNumber: {
      test: (pass) => /\d/.test(pass),
      message: "Must contain number",
    },
    hasSpecialChar: {
      test: (pass) => /[!@#$%^&*(),.?":{}|<>]/.test(pass),
      message: "Must contain special character",
    },
  };

  return (
    <div className="space-y-1 p-3">
      {Object.entries(requirements).map(([key, requirement]) => {
        const isMet = requirement.test(password);
        return (
          <div
            key={key}
            className="flex items-center text-sm transition-colors duration-200"
          >
            {isMet ? (
              <Check className="w-4 h-4 text-green-500 mr-2 shrink-0" />
            ) : (
              <X className="w-4 h-4 text-red-500 mr-2 shrink-0" />
            )}
            <span className={isMet ? "text-green-700" : "text-red-700"}>
              {requirement.message}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default PasswordRequirements;
