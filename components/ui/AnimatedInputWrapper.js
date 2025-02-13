import React from "react";
import { motion } from "framer-motion";

const AnimatedInputWrapper = ({ children, shouldShake, className = "" }) => {
  return (
    <motion.div
      className={className}
      animate={
        shouldShake
          ? {
              x: [0, -40, 40, -40, 40, -25, 25, 0],
              y: [0, -10, 10, -10, 10, -5, 5, 0],
              transition: {
                duration: 0.5,
                ease: "easeInOut",
              },
            }
          : { x: 0, y: 0 }
      }
    >
      {children}
    </motion.div>
  );
};

export default AnimatedInputWrapper;
