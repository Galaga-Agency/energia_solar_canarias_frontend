"use client";

import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useForm } from "react-hook-form";
import { useTranslation } from "next-i18next";
import useLocalStorageState from "use-local-storage-state";
import PrimaryButton from "./PrimaryButton";
import SecondaryButton from "./SecondaryButton";

const ProfileOverviewCard = ({
  user,
  onUpdateProfile,
  profilePic,
  setProfilePic,
}) => {
  const { t } = useTranslation();
  const [isFlipped, setIsFlipped] = useState(false);
  const { register, handleSubmit } = useForm();
  const [theme] = useLocalStorageState("theme", { defaultValue: "dark" });

  const handleEditClick = () => {
    setIsFlipped(true);
  };

  const handleCancelEdit = () => {
    setIsFlipped(false);
  };

  const onSubmit = (data) => {
    onUpdateProfile(data);
    setIsFlipped(false);
  };

  return (
    <div className="relative w-full perspective">
      <div
        className={`relative min-h-[900px] transition-transform duration-700 transform-style-3d ${
          isFlipped ? "rotate-y-180" : ""
        }`}
      >
        {/* Front Face */}
        <div className="absolute w-full h-full bg-white dark:bg-gray-800 rounded-lg shadow-dark-shadow border border-gray-200 dark:border-gray-700 p-6 backface-hidden">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-gray-800 dark:text-gray-200">
            {t("profileOverview")}
          </h2>
          <div className="flex flex-col items-center mb-8">
            <div className="relative w-48 h-48 my-4">
              <Image
                src={profilePic}
                alt="Profile"
                fill
                className="rounded-full border-4 border-custom-dark-blue dark:border-custom-yellow shadow-dark-shadow"
              />
            </div>
            <button
              type="button"
              onClick={handleEditClick}
              className="absolute top-3 right-2 p-2 text-custom-dark-blue dark:text-custom-yellow transition-colors"
              aria-label="Edit profile"
            >
              <FontAwesomeIcon icon={faPen} className="text-xl" />
            </button>
          </div>
          <div className="space-y-4 text-gray-700 mb-2">
            <p className="flex justify-between gap-2">
              <span className="block mb-1 text-gray-500 dark:text-custom-dark-gray">
                {t("name")}:
              </span>
              <span className="text-custom-dark-blue dark:text-custom-yellow text-right">
                {user?.nombre}
              </span>
            </p>
            <p className="flex justify-between gap-2">
              <span className="block mb-1 text-gray-500 dark:text-custom-dark-gray">
                {t("surname")}:
              </span>
              <span className="text-custom-dark-blue dark:text-custom-yellow text-right">
                {user?.apellido}
              </span>
            </p>
            <p className="flex justify-between gap-2">
              <span className="block mb-1 text-gray-500 dark:text-custom-dark-gray">
                {t("email")}:
              </span>
              <span className="text-custom-dark-blue dark:text-custom-yellow text-right">
                {user?.email}
              </span>
            </p>
            <p className="flex justify-between gap-2">
              <span className="block mb-1 text-gray-500 dark:text-custom-dark-gray">
                {t("mobile")}:
              </span>
              <span className="text-custom-dark-blue dark:text-custom-yellow text-right">
                {user?.movil}
              </span>
            </p>
            <p className="flex justify-between gap-2">
              <span className="block mb-1 text-gray-500 dark:text-custom-dark-gray">
                {t("company")}:
              </span>
              <span className="text-custom-dark-blue dark:text-custom-yellow text-right">
                {user?.company}
              </span>
            </p>
            <p className="flex justify-between gap-2">
              <span className="block mb-1 text-gray-500 dark:text-custom-dark-gray">
                {t("userAdress")}:
              </span>
              <span className="text-custom-dark-blue dark:text-custom-yellow text-right">
                {user?.address}
              </span>
            </p>
            <p className="flex justify-between gap-2">
              <span className="block mb-1 text-gray-500 dark:text-custom-dark-gray">
                {t("city")}:
              </span>
              <span className="text-custom-dark-blue dark:text-custom-yellow text-right">
                {user?.city}
              </span>
            </p>
            <p className="flex justify-between gap-2">
              <span className="block mb-1 text-gray-500 dark:text-custom-dark-gray">
                {t("postcode")}:
              </span>
              <span className="text-custom-dark-blue dark:text-custom-yellow text-right">
                {user?.postcode}
              </span>
            </p>
            <p className="flex justify-between gap-2">
              <span className="block mb-1 text-gray-500 dark:text-custom-dark-gray">
                {t("regionState")}:
              </span>
              <span className="text-custom-dark-blue dark:text-custom-yellow text-right">
                {user?.region}
              </span>
            </p>
            <p className="flex justify-between gap-2">
              <span className="block mb-1 text-gray-500 dark:text-custom-dark-gray">
                {t("country")}:
              </span>
              <span className="text-custom-dark-blue dark:text-custom-yellow text-right">
                {user?.country}
              </span>
            </p>
            <p className="flex justify-between gap-2">
              <span className="block mb-1 text-gray-500 dark:text-custom-dark-gray">
                {t("cifNif")}:
              </span>
              <span className="text-custom-dark-blue dark:text-custom-yellow text-right">
                {user?.cifNif}
              </span>
            </p>
            <p className="flex justify-between gap-2">
              <span className="block mb-1 text-gray-500 dark:text-custom-dark-gray">
                {t("userStatus")}:
              </span>
              <span className="text-custom-dark-blue dark:text-custom-yellow text-right">
                {user?.clase.charAt(0).toUpperCase() + user?.clase.slice(1)}
              </span>
            </p>
          </div>
        </div>

        {/* Back Face */}
        <div className="absolute w-full h-full bg-white dark:bg-gray-800 rounded-lg shadow-dark-shadow border border-gray-200 dark:border-gray-700 p-6 backface-hidden rotate-y-180">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-gray-800 dark:text-gray-200">
            {t("editProfile")}
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex flex-col items-center">
              <div className="relative w-32 h-32 mb-4">
                <Image
                  src={profilePic}
                  alt="Profile"
                  fill
                  className="rounded-full border-4 border-custom-dark-blue dark:border-custom-yellow shadow-dark-shadow"
                />
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setProfilePic(reader.result);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="hidden"
              />
            </div>
            <input
              type="text"
              defaultValue={user?.nombre}
              {...register("name")}
              className="pb-1 w-full text-custom-dark-blue dark:text-custom-yellow border-b rounded-tl-sm rounded-tr-sm px-2 py-1 bg-custom-light-gray/20 dark:bg-white/10 text-lg focus:outline-none transition duration-600"
              placeholder={t("name")}
              required
            />
            <input
              type="text"
              defaultValue={user?.apellido}
              {...register("surname")}
              className="pb-1 w-full text-custom-dark-blue dark:text-custom-yellow border-b rounded-tl-sm rounded-tr-sm px-2 py-1 bg-custom-light-gray/20 dark:bg-white/10 text-lg focus:outline-none transition duration-600"
              placeholder={t("surname")}
              required
            />
            <input
              type="email"
              defaultValue={user?.email}
              {...register("email")}
              className="pb-1 w-full text-custom-dark-blue dark:text-custom-yellow border-b rounded-tl-sm rounded-tr-sm px-2 py-1 bg-custom-light-gray/20 dark:bg-white/10 text-lg focus:outline-none transition duration-600"
              placeholder={t("email")}
              required
            />
            <PhoneInput
              country="es"
              defaultValue={user?.movil}
              onChange={(phone) => register("mobile").onChange(phone)}
              inputStyle={{
                width: "100%",
                border: "none",
                background: "rgb(201 202 202 / 0.2)",
                fontSize: "16px",
                padding: "8px 50px",
                borderRadius: "4px 4px 0 0",
                color: theme === "dark" ? "rgb(255 213 122)" : "rgb(0 44 63)",
              }}
              buttonStyle={{
                background:
                  theme === "dark"
                    ? "rgb(255 255 255 / 0.1)"
                    : "rgb(201 202 202 / 0.2)",
              }}
              dropdownStyle={{
                background:
                  theme === "dark"
                    ? "rgb(255 255 255 / 0.9)"
                    : "rgb(201 202 202 / 0.9)",
                borderRadius: 10,
              }}
            />
            <input
              type="text"
              defaultValue={user?.company}
              {...register("company")}
              className="pb-1 w-full text-custom-dark-blue dark:text-custom-yellow border-b rounded-tl-sm rounded-tr-sm px-2 py-1 bg-custom-light-gray/20 dark:bg-white/10 text-lg focus:outline-none transition duration-600"
              placeholder={t("company")}
            />
            <input
              type="text"
              defaultValue={user?.address}
              {...register("address")}
              className="pb-1 w-full text-custom-dark-blue dark:text-custom-yellow border-b rounded-tl-sm rounded-tr-sm px-2 py-1 bg-custom-light-gray/20 dark:bg-white/10 text-lg focus:outline-none transition duration-600"
              placeholder={t("address")}
            />
            <input
              type="text"
              defaultValue={user?.city}
              {...register("city")}
              className="pb-1 w-full text-custom-dark-blue dark:text-custom-yellow border-b rounded-tl-sm rounded-tr-sm px-2 py-1 bg-custom-light-gray/20 dark:bg-white/10 text-lg focus:outline-none transition duration-600"
              placeholder={t("city")}
            />
            <input
              type="text"
              defaultValue={user?.postcode}
              {...register("postcode")}
              className="pb-1 w-full text-custom-dark-blue dark:text-custom-yellow border-b rounded-tl-sm rounded-tr-sm px-2 py-1 bg-custom-light-gray/20 dark:bg-white/10 text-lg focus:outline-none transition duration-600"
              placeholder={t("postcode")}
            />
            <input
              type="text"
              defaultValue={user?.region}
              {...register("region")}
              className="pb-1 w-full text-custom-dark-blue dark:text-custom-yellow border-b rounded-tl-sm rounded-tr-sm px-2 py-1 bg-custom-light-gray/20 dark:bg-white/10 text-lg focus:outline-none transition duration-600"
              placeholder={t("regionState")}
            />
            <input
              type="text"
              defaultValue={user?.country}
              {...register("country")}
              className="pb-1 w-full text-custom-dark-blue dark:text-custom-yellow border-b rounded-tl-sm rounded-tr-sm px-2 py-1 bg-custom-light-gray/20 dark:bg-white/10 text-lg focus:outline-none transition duration-600"
              placeholder={t("country")}
            />
            <input
              type="text"
              defaultValue={user?.cifNif}
              {...register("cifNif")}
              className="pb-1 w-full text-custom-dark-blue dark:text-custom-yellow border-b rounded-tl-sm rounded-tr-sm px-2 py-1 bg-custom-light-gray/20 dark:bg-white/10 text-lg focus:outline-none transition duration-600"
              placeholder={t("cifNif")}
            />
            <div className="flex  mt-6">
              <SecondaryButton type="SecondaryB" onClick={handleCancelEdit}>
                {t("cancel")}
              </SecondaryButton>
              <PrimaryButton type="submit">{t("save")}</PrimaryButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileOverviewCard;
