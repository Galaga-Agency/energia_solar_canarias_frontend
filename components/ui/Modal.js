import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";

const Modal = ({
  isOpen,
  onClose,
  children,
  className = "",
  backdropClass = "",
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"; // Prevent scrolling when modal is open
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[1000] flex items-center justify-center">
        {/* Clickable Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={`absolute inset-0 bg-black/40 backdrop-blur-sm ${backdropClass}`}
          onClick={onClose} // Clicking backdrop closes modal
        />

        {/* Modal Content */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className={`relative z-10 rounded-lg shadow-lg ${className}`}
          onClick={(e) => e.stopPropagation()} // Prevent click inside from closing modal
        >
          {children}
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
};

export default Modal;
