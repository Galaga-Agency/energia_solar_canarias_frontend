import React from "react";
import { createPortal } from "react-dom";
import PrimaryButton from "@/components/ui/PrimaryButton"; // Assuming this is the correct path
import SecondaryButton from "@/components/ui/SecondaryButton"; // Assuming this is the correct path

const Dialog = ({ open, onOpenChange, children }) => {
  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div
        className="fixed inset-0 bg-black/50"
        onClick={() => onOpenChange(false)}
      />
      <div className="relative z-50 max-w-3xl mx-auto bg-custom-light-gray dark:bg-custom-dark-blue text-custom-dark-blue dark:text-custom-light-gray rounded-lg shadow-lg p-8 space-y-6 w-full">
        {children}
      </div>
    </div>,
    document.body
  );
};

const DialogContent = ({ children, className = "" }) => (
  <div
    className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 max-h-[90vh] overflow-y-auto w-full max-w-4xl ${className}`}
  >
    {children}
  </div>
);

const DialogHeader = ({ children, className = "" }) => (
  <div
    className={`mb-6 text-2xl font-semibold text-custom-dark-blue dark:text-custom-light-gray ${className}`}
  >
    {children}
  </div>
);

const DialogTitle = ({ children, className = "" }) => (
  <h2 className={`text-2xl font-bold ${className}`}>{children}</h2>
);

const DialogFooter = ({
  onClose,
  onSubmit,
  cancelText = "Cancelar",
  submitText = "Aplicar",
}) => (
  <div className="flex gap-6 justify-end mt-8">
    <SecondaryButton
      type="button"
      onClick={onClose}
      className="py-2 px-6 rounded-md text-gray-600 dark:text-gray-300"
    >
      {cancelText}
    </SecondaryButton>
    <PrimaryButton
      type="button"
      onClick={onSubmit}
      className="py-2 px-6 rounded-md bg-custom-blue hover:bg-custom-dark-blue text-white"
    >
      {submitText}
    </PrimaryButton>
  </div>
);

export { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter };
