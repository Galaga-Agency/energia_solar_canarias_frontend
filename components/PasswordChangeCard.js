import { useState, useRef } from "react";
import { useTranslation } from "next-i18next";
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";
import PrimaryButton from "./ui/PrimaryButton";

const PasswordChangeCard = ({ onChangePassword }) => {
  const { t } = useTranslation();
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [isFlipped, setIsFlipped] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const timerRef = useRef(null);

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (newPassword && newPassword !== repeatPassword) {
      setFeedbackMessage(t("passwordsDoNotMatch"));
      setIsSuccess(false);
      setIsFlipped(true);
      flipBack();
      return;
    }

    try {
      const response = await onChangePassword(newPassword);
      if (response.success) {
        setFeedbackMessage(t("passwordChangeSuccess"));
        setIsSuccess(true);
      } else {
        setFeedbackMessage(t("passwordChangeFailed"));
        setIsSuccess(false);
      }
    } catch (error) {
      setFeedbackMessage(t("passwordChangeFailed"));
      setIsSuccess(false);
    }
    setNewPassword("");
    setRepeatPassword("");
    setIsFlipped(true);
    flipBack();
  };

  const flipBack = () => {
    timerRef.current = setTimeout(() => {
      setIsFlipped(false);
    }, 3000); // Flip back after 3 seconds
  };

  return (
    <div className="relative w-full perspective md:-mt-6">
      <div
        className={`relative h-[280px] transition-transform duration-700 transform-style-3d ${
          isFlipped ? "rotate-y-180" : ""
        }`}
      >
        {/* Front Face - Password Change Form */}
        <div className="absolute w-full h-full bg-white/50 dark:bg-gray-800/60 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 backdrop-blur-sm backdrop-filter backface-hidden">
          <h2 className="text-xl mb-4 border-b border-b-custom-dark-blue dark:border-b-custom-light-gray pb-2 text-gray-800 dark:text-gray-200">
            {t("changePassword")}
          </h2>
          <form onSubmit={handlePasswordChange} className="space-y-6">
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 bg-gray-50/50 dark:bg-gray-900/50 text-gray-800 dark:text-custom-yellow border-b border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-custom-yellow transition"
              placeholder={t("newPassword")}
              required
            />
            <input
              type="password"
              value={repeatPassword}
              onChange={(e) => setRepeatPassword(e.target.value)}
              className="w-full px-4 py-2 bg-gray-50/50 dark:bg-gray-900/50 text-gray-800 dark:text-custom-yellow border-b border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-custom-yellow transition"
              placeholder={t("repeatPassword")}
              required
            />
            <PrimaryButton type="submit" className="text-nowrap">
              {t("updatePassword")}
            </PrimaryButton>
          </form>
        </div>

        {/* Back Face - Feedback */}
        <div className="absolute w-full h-full bg-white/30 dark:bg-gray-800/30 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 backdrop-blur-lg backdrop-filter backface-hidden rotate-y-180 flex items-center justify-center">
          <div className="text-center">
            {isSuccess ? (
              <AiOutlineCheckCircle className="flex mx-auto text-5xl text-green-500 mb-4" />
            ) : (
              <AiOutlineCloseCircle className="flex mx-auto text-5xl text-red-500 mb-4" />
            )}
            <p className="text-xl text-gray-800 dark:text-gray-200 mb-6">
              {feedbackMessage}
            </p>
            <PrimaryButton onClick={() => setIsFlipped(false)}>
              {t("backToForm")}
            </PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordChangeCard;
