"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import logoLight from "@/public/assets/logos/ENERGIA SOLAR CANARIAS - NEGRO.png";
import logoDark from "@/public/assets/logos/ENERGIA SOLAR CANARIAS - BLANCO.png";
import TransitionEffect from "@/components/TransitionEffect";
import AuthenticationForm from "@/components/AuthenticationForm";
import useDeviceType from "@/hooks/useDeviceType";
import RetroGrid from "@/components/RetroGrid";
import { useSelector } from "react-redux";
import { selectTheme } from "@/store/slices/themeSlice";
import Loading from "./ui/Loading";

const LogoAnimation = () => {
  const [showTransition, setShowTransition] = useState(true);
  const userData = useSelector((state) => state.user?.user);
  const [showLogo, setShowLogo] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const { isMobile, isTablet } = useDeviceType();
  const theme = useSelector(selectTheme);
  const initialLogoSize = isMobile ? 350 : isTablet ? 500 : 350;
  const finalLogoSize = isMobile ? 150 : isTablet ? 200 : 200;

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
              src={theme === "light" ? logoLight : logoDark}
              alt="Logo"
              width={initialLogoSize}
              height={initialLogoSize}
              className="object-contain w-full h-auto"
              priority
              sizes="(max-width: 768px) 150px, (max-width: 1024px) 200px, 250px"
            />
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showForm &&
          (!userData ? (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, ease: "easeInOut" }}
              className="z-30 absolute w-full"
            >
              <AuthenticationForm />
            </motion.div>
          ) : (
            <Loading theme={theme} />
          ))}
      </AnimatePresence>
      <RetroGrid />
    </div>
  );
};

export default LogoAnimation;
