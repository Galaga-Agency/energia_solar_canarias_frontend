"use client";
import { motion } from "framer-motion";
import useDeviceType from "@/hooks/useDeviceType";

const PageTransition = ({ children }) => {
  const { isDesktop } = useDeviceType();

  const xValue = isDesktop ? 800 : 200;

  const variants = {
    hidden: { opacity: 0, x: xValue, y: 0 },
    enter: { opacity: 1, x: 0, y: 0 },
  };

  return (
    <motion.main
      variants={variants}
      initial="hidden"
      animate="enter"
      transition={{ type: "tween", duration: 0.5 }}
    >
      {children}
    </motion.main>
  );
};

export default PageTransition;
