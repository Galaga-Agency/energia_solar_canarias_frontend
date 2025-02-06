import React from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import Texture from "@/components/Texture";
import Modal from "@/components/ui/Modal";

const StatsDetailModal = ({
  isOpen,
  onClose,
  title,
  children,
  icon: Icon,
  className = "",
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className={`w-full max-w-[90vw] md:max-w-4xl p-4 rounded-2xl shadow-xl overflow-hidden bg-gradient-to-br from-white/90 to-white/50 dark:from-custom-dark-blue/90 dark:to-custom-dark-blue/50 backdrop-blur-lg ${className}`}
    >
      <Texture className="opacity-30" />

      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center justify-between gap-2 py-4 px-6 bg-gradient-to-r from-custom-yellow to-custom-yellow/90 rounded-xl text-custom-dark-blue mb-6"
      >
        <div className="flex items-center gap-2">
          {Icon && <Icon className="text-2xl" />}
          <h2 className="text-xl md:text-2xl mt-2">{title}</h2>
        </div>

        {/* Close Button */}
        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="flex-shrink-0 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5"
        >
          <X className="h-6 w-6 text-custom-dark-blue" />
        </motion.button>
      </motion.div>

      {/* Content */}
      <div className="max-h-[70vh] overflow-y-auto custom-scrollbar md:p-2">
        {children}
      </div>
    </Modal>
  );
};

export default StatsDetailModal;
