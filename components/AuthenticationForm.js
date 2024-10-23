import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { motion } from "framer-motion";
import { useTranslation } from "next-i18next";
import { validateToken, setUser } from "@/store/slices/userSlice";
import FormFace from "./FormFace";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import ResultContent from "./ResultContent";

const AuthenticationForm = () => {
  const [currentFace, setCurrentFace] = useState("login");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [tokenInput, setTokenInput] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();
  const { t } = useTranslation();
  const [userToValidate, setUserToValidate] = useState();

  const handleTokenSubmit = async () => {
    if (!tokenInput.trim() || !userToValidate) return;
    try {
      const response = await dispatch(
        validateToken({ id: userToValidate, token: tokenInput })
      ).unwrap();

      if (response.status === "success") {
        dispatch(setUser(response.data));
        Cookies.set("user", JSON.stringify(response.data), { expires: 7 });
        setTokenInput("");
        router.push(`/dashboard/${userToValidate}/plants`);
      } else {
        setSubmissionResult({
          status: "loginError",
          message: t("invalidUser"),
        });
      }
    } catch (error) {
      setSubmissionResult({
        status: "loginError",
        message: t("invalidUser"),
      });
    }
  };

  const getRotation = () => {
    const rotations = {
      login: 0,
      register: 180,
      result: 360,
    };
    return `rotateY(${rotations[currentFace]}deg)`;
  };

  return (
    <div className="relative w-full max-w-[90vw] md:max-w-[50vw] lg:max-w-[35vw] xl:max-w-[30vw] 2xl:max-w-[20vw] mx-auto mt-8 z-0">
      <div
        className="relative w-full h-[550px]"
        style={{ perspective: "1000px" }}
      >
        <motion.div
          className="absolute w-full h-full"
          style={{
            transformStyle: "preserve-3d",
            transform: getRotation(),
            transition: "transform 0.8s ease-in-out",
          }}
        >
          <FormFace isActive={currentFace === "login"} rotation={0}>
            <LoginForm setCurrentFace={setCurrentFace} />
          </FormFace>

          <FormFace isActive={currentFace === "register"} rotation={180}>
            <RegisterForm setCurrentFace={setCurrentFace} />
          </FormFace>

          <FormFace isActive={currentFace === "result"} rotation={0}>
            <ResultContent
              isSubmitting={isSubmitting}
              submissionResult={submissionResult}
              tokenInput={tokenInput}
              setTokenInput={setTokenInput}
              handleTokenSubmit={handleTokenSubmit}
            />
          </FormFace>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthenticationForm;
