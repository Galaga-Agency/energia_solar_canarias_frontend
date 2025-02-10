import React, { useState } from "react";
import { Check, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { updateUserPassword, selectUser } from "@/store/slices/userSlice";
import PasswordInput from "@/components/ui/PasswordInput";
import { useTranslation } from "next-i18next";

const PasswordChangeCard = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Password validation requirements - exact match from PasswordForm
  const requirements = {
    minLength: {
      test: (password) => password.length >= 8,
      messageKey: "passwordMinLengthRequirement",
    },
    hasUppercase: {
      test: (password) => /[A-Z]/.test(password),
      messageKey: "passwordUppercaseRequirement",
    },
    hasLowercase: {
      test: (password) => /[a-z]/.test(password),
      messageKey: "passwordLowercaseRequirement",
    },
    hasNumber: {
      test: (password) => /\d/.test(password),
      messageKey: "passwordNumberRequirement",
    },
    hasSpecialChar: {
      test: (password) => /[!@#$%^&*(),.?":{}|<>]/.test(password),
      messageKey: "passwordSpecialCharRequirement",
    },
  };

  const validatePassword = (password) => {
    const newErrors = {};

    Object.entries(requirements).forEach(([key, requirement]) => {
      if (!requirement.test(password)) {
        newErrors[key] = t(requirement.messageKey);
      }
    });

    return newErrors;
  };

  const handleNewPasswordChange = (e) => {
    const value = e.target.value;
    setNewPassword(value);
    setErrors(validatePassword(value));
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    if (value !== newPassword) {
      setErrors((prev) => ({ ...prev, confirm: t("passwordsDoNotMatch") }));
    } else {
      setErrors((prev) => {
        const { confirm, ...rest } = prev;
        return rest;
      });
    }
  };

  const isValid = () => {
    return (
      newPassword === confirmPassword &&
      newPassword.length >= 8 &&
      Object.keys(errors).length === 0 &&
      !isSubmitting
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValid()) return;

    setIsSubmitting(true);

    try {
      await dispatch(
        updateUserPassword({
          userId: user.usuario_id || user.id,
          password: newPassword,
        })
      ).unwrap();

      // Reset form after successful submission
      setNewPassword("");
      setConfirmPassword("");
      setErrors({});
      setShowNewPassword(false);
      setShowConfirmPassword(false);

      toast.success(t("passwordUpdatedSuccessfully"));
    } catch (error) {
      console.error("Failed to update password:", error);
      toast.error(t("failedToUpdatePassword"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <h2 className="text-xl text-custom-dark-blue dark:text-custom-yellow mb-4">
        {t("security")}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <h4 className="text-sm font-secondary text-gray-700 dark:text-gray-300">
          {t("changePassword")}
        </h4>

        <div className="space-y-4">
          <div>
            <PasswordInput
              value={newPassword}
              onChange={handleNewPasswordChange}
              placeholder={t("enterNewPassword")}
              showPassword={showNewPassword}
              onTogglePassword={() => setShowNewPassword(!showNewPassword)}
            />
            {/* Password requirements indicator */}
            <div className="mt-2 space-y-1">
              {Object.entries(requirements).map(([key, requirement]) => (
                <div key={key} className="flex items-center text-sm">
                  {newPassword.length === 0 ? (
                    <div className="w-4 h-4 mr-2" />
                  ) : !requirement.test(newPassword) ? (
                    <X className="w-4 h-4 text-red-500 mr-2" />
                  ) : (
                    <Check className="w-4 h-4 text-green-500 mr-2" />
                  )}
                  <span
                    className={
                      newPassword.length === 0
                        ? "text-gray-500 dark:text-gray-400"
                        : requirement.test(newPassword)
                        ? "text-green-500"
                        : "text-red-500"
                    }
                  >
                    {t(requirement.messageKey)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <PasswordInput
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              placeholder={t("confirmNewPassword")}
              showPassword={showConfirmPassword}
              onTogglePassword={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
            />
            {errors.confirm && (
              <p className="mt-1 text-sm text-red-500">{errors.confirm}</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={!isValid()}
          className="w-full bg-custom-yellow text-custom-dark-blue py-2.5 px-4 rounded-lg hover:bg-custom-yellow/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all duration-200"
        >
          {isSubmitting ? (
            <>
              <span className="animate-spin">⋅</span>
              {t("updating")}
            </>
          ) : (
            <>
              <Check className="w-4 h-4" />
              {t("updatePassword")}
            </>
          )}
        </button>
      </form>
    </>
  );
};

export default PasswordChangeCard;
