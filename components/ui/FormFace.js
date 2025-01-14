import React from "react";
import { motion } from "framer-motion";
import Texture from "../Texture";

const FormFace = ({ isActive, rotation, children, formType }) => (
  <motion.div
    className={`absolute w-full h-full rounded-2xl p-0 md:p-4 bg-white/50 dark:bg-custom-dark-blue/50 backdrop-blur-sm shadow-xl ${
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
    <div
      className={`h-full flex flex-col justify-start md:justify-center px-6 py-8 overflow-y-auto custom-scrollbar`}
      style={{ maxHeight: "100vh" }}
    >
      <div className="space-y-5 flex flex-col">
        <Texture />
        {children}
      </div>
    </div>
  </motion.div>
);

export default FormFace;
