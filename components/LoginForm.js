import React from "react";
import { useForm } from "react-hook-form";
import FormInput from "./FormInput";
import PrimaryButton from "./PrimaryButton";
import { useTranslation } from "next-i18next";
import { authenticateUser, selectLoading } from "@/store/slices/userSlice";
import { useDispatch, useSelector } from "react-redux";
import useAuth from "@/hooks/useAuth";

const LoginForm = ({ setCurrentFace }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { saveAuthData } = useAuth();
  const loading = useSelector(selectLoading);
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const handleLogin = async (data) => {
    try {
      const user = await dispatch(authenticateUser(data)).unwrap();
      saveAuthData("mockAuthToken", user);
      setCurrentFace("result");
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  return (
    <>
      <h2 className="text-gray-800 dark:text-gray-200 text-2xl text-center mb-4">
        {t("login")}
      </h2>
      <form
        onSubmit={handleSubmit(handleLogin)}
        noValidate
        className="space-y-3"
      >
        <FormInput
          label={t("email")}
          error={errors.email}
          register={register}
          name="email"
          type="email"
          placeholder={t("emailPlaceholder")}
        />
        <FormInput
          label={t("password")}
          error={errors.password}
          register={register}
          name="password"
          type="password"
          placeholder={t("passwordPlaceholder")}
        />
        <br />
        <PrimaryButton type="submit" disabled={loading}>
          {t("signIn")}
        </PrimaryButton>
      </form>
      <div className="mt-4 text-center">
        <p className="text-gray-800 dark:text-gray-200 text-sm mt-4">
          {t("noAccount")}{" "}
          <button
            type="button"
            onClick={() => setCurrentFace("register")}
            className="text-gray-800 dark:text-gray-200 text-md underline"
          >
            {t("register")}
          </button>
        </p>
      </div>
    </>
  );
};

export default LoginForm;
