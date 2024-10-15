"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import logo from "@/public/assets/img/logo.webp";
import TransitionEffect from "./TransitionEffect";
import AuthenticationForm from "./AuthenticationForm";
import useDeviceType from "@/hooks/useDeviceType";
import RetroGrid from "./RetroGrid";

const LogoAnimation = () => {
  const [showTransition, setShowTransition] = useState(true);
  const [showLogo, setShowLogo] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const { isMobile, isTablet } = useDeviceType();

  const initialLogoSize = isMobile ? 350 : isTablet ? 500 : "auto";
  const finalLogoSize = isMobile ? 150 : isTablet ? 200 : 250;

  useEffect(() => {
    const transitionTimer = setTimeout(() => setShowTransition(false), 1500);
    const logoTimer = setTimeout(() => setShowLogo(true), 1000);
    const moveLogoTimer = setTimeout(() => {
      setShowForm(true);
    }, 3000);

    return () => {
      clearTimeout(transitionTimer);
      clearTimeout(logoTimer);
      clearTimeout(moveLogoTimer);
    };
  }, []);

  return (
    <div className="h-screen w-screen flex justify-center items-center bg-custom-dark-gray dark:bg-gray-900 text-gray-900 dark:text-gray-100 relative overflow-hidden transition-colors duration-500">
      {showTransition && <TransitionEffect />}
      <AnimatePresence>
        {showLogo && (
          <motion.div
            key="logo"
            initial={{
              opacity: 0,
              width: initialLogoSize,
              height: initialLogoSize,
              top: "50%",
              left: "50%",
              x: "-50%",
              y: "-50%",
            }}
            animate={{
              opacity: 1,
              width: showForm ? finalLogoSize : initialLogoSize,
              height: showForm ? finalLogoSize : initialLogoSize,
              top: showForm ? "20px" : "50%",
              left: showForm ? "20px" : "50%",
              x: showForm ? 0 : "-50%",
              y: showForm ? 0 : "-50%",
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 1.5,
              ease: "easeInOut",
            }}
            className="z-40 fixed"
          >
            <Image
              src={logo}
              alt="Logo"
              layout="responsive"
              width={100}
              height={100}
              priority
            />
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showForm && (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="z-30 absolute w-full"
          >
            <AuthenticationForm />
          </motion.div>
        )}
      </AnimatePresence>
      <RetroGrid />
    </div>
  );
};

export default LogoAnimation;
