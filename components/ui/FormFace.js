import React from "react";
import { motion } from "framer-motion";

const FormFace = ({ isActive, rotation, children }) => (
  <motion.div
    className="absolute w-full h-full p-6 bg-gradient-to-b from-gray-200 to-custom-dark-gray rounded-lg flex flex-col justify-center space-y-4 z-40 dark:from-gray-800 dark:to-gray-900 shadow-dark-shadow dark:shadow-white-shadow"
    style={{
      backfaceVisibility: "hidden",
      transform: `rotateY(${rotation}deg)`,
      opacity: isActive ? 1 : 0,
      pointerEvents: isActive ? "auto" : "none",
      transition: "opacity 0.5s ease-in-out",
    }}
  >
    {children}
  </motion.div>
);

export default FormFace;
