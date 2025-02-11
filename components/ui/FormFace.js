import React from "react";
import { motion } from "framer-motion";
import Texture from "../Texture";

const FormFace = ({ isActive, rotation, children, formType }) => (
  <motion.div
    className={`absolute w-full h-full rounded-2xl bg-white/80 dark:bg-custom-dark-blue backdrop-blur-sm shadow-xl ${
      isActive ? "pointer-events-auto" : "pointer-events-none"
    }`}
    style={{
      backfaceVisibility: "hidden",
      WebkitBackfaceVisibility: "hidden",
      transform: `rotateY(${rotation}deg)`,
      opacity: isActive ? 1 : 0,
      transition: "opacity 0.3s ease-in-out",
    }}
  >
    <div className="relative h-full w-full flex items-center justify-center p-4">
      <div className="w-full max-h-full overflow-y-auto custom-scrollbar">
        <div className="min-h-min px-4 py-6 space-y-4">
          <Texture />
          {children}
        </div>
      </div>
    </div>
  </motion.div>
);

export default FormFace;
