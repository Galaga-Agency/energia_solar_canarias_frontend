import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus } from "react-icons/fi";

const AddPlantForm = ({ onClose, isOpen }) => {
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 grid place-items-center overflow-hidden"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-md"
          />

          <motion.div
            initial={{ scale: 0, rotate: "12.5deg" }}
            animate={{ scale: 1, rotate: "0deg" }}
            exit={{ scale: 0, rotate: "0deg" }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-full overflow-hidden relative z-10"
          >
            <div className="bg-gradient-to-br from-violet-600 to-indigo-600 text-white p-4 flex items-center">
              <FiPlus className="text-2xl mr-2" />
              <h2 className="text-lg font-bold">Add a New Plant</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <div className="mb-4">
                <label className="block mb-1">Plant Name</label>
                <input
                  type="text"
                  required
                  className="w-full border rounded p-2"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">Description</label>
                <textarea
                  required
                  className="w-full border rounded p-2"
                  rows="4"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-custom-yellow text-custom-dark-blue px-4 py-2 rounded"
                >
                  Add Plant
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="ml-4 text-red-500"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddPlantForm;
