import React from "react";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";

const DangerZone = ({ onDelete, t }) => {
  return (
    <div className="bg-red-50 dark:bg-red-900/10 rounded-xl p-6 shadow-sm">
      <h2 className="text-xl text-red-600/80 dark:text-red-400/80 mb-4">
        {t("dangerZone")}
      </h2>
      <p className="text-sm text-red-600/80 dark:text-red-400/80 mb-4">
        {t("deleteAccountWarning")}
      </p>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onDelete}
        className="w-full bg-red-500 text-white py-2.5 px-4 rounded-lg hover:bg-red-600 flex items-center justify-center gap-2"
      >
        <Trash2 className="w-4 h-4" />
        {t("deleteAccount")}
      </motion.button>
    </div>
  );
};

export default DangerZone;
