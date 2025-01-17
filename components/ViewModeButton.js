import { motion } from "framer-motion";

const ViewModeButton = ({ isActive, onClick, icon: Icon, label }) => (
  <motion.button
    onClick={onClick}
    className={`p-2 rounded-lg transition-colors ${
      isActive
        ? "bg-custom-dark-blue dark:bg-custom-yellow text-white dark:text-custom-dark-blue"
        : "text-custom-dark-blue dark:text-custom-yellow hover:bg-white/10 dark:hover:bg-gray-800/50"
    }`}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    <Icon className="w-5 h-5" />
  </motion.button>
);

export default ViewModeButton;
