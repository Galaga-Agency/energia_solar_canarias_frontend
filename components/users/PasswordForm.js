import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Check } from "lucide-react";
import PasswordInput from "@/components/ui/PasswordInput";

const PasswordForm = ({ handleSave, t }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    mode: "onChange", // Track validity as the user types
  });

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <form onSubmit={handleSubmit((data) => handleSave(data))}>
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {t("changePassword")}
        </h4>

        {/* New Password Input */}
        <PasswordInput
          placeholder={t("enterNewPassword")}
          showPassword={showNewPassword}
          onTogglePassword={() => setShowNewPassword(!showNewPassword)}
          register={() =>
            register("newPassword", {
              required: t("passwordIsRequired"),
              minLength: {
                value: 6,
                message: t("passwordTooShort"),
              },
            })
          }
          error={errors.newPassword?.message}
        />

        {/* Confirm Password Input */}
        <PasswordInput
          placeholder={t("confirmNewPassword")}
          showPassword={showConfirmPassword}
          onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
          register={() =>
            register("confirmPassword", {
              required: t("confirmPasswordIsRequired"),
              validate: (value) =>
                value === watch("newPassword") || t("passwordsDoNotMatch"),
            })
          }
          error={errors.confirmPassword?.message}
        />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isValid || isSubmitting} // Disable if the form is incomplete or submitting
          className="w-full bg-custom-yellow text-white py-2.5 px-4 rounded-lg hover:bg-custom-yellow/90 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Check className="w-4 h-4" />
          {t("updatePassword")}
        </button>
      </div>
    </form>
  );
};

export default PasswordForm;
