"use client";

import React, { useState, useRef } from "react";
import { BiPencil } from "react-icons/bi";
import Image from "next/image";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useForm } from "react-hook-form";
import { useTranslation } from "next-i18next";
import useLocalStorageState from "use-local-storage-state";
import PrimaryButton from "./PrimaryButton";
import SecondaryButton from "./SecondaryButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { updateUserProfile } from "@/store/slices/userSlice";

const ProfileOverviewCard = ({ user, profilePic, setProfilePic }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [isFlipped, setIsFlipped] = useState(false);
  const { register, handleSubmit } = useForm();
  const [theme] = useLocalStorageState("theme", { defaultValue: "dark" });

  const fileInputRef = useRef(null);

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditClick = () => {
    setIsFlipped(true);
  };

  const handleCancelEdit = () => {
    setIsFlipped(false);
  };

  const onSubmit = (data) => {
    dispatch(updateUserProfile({ ...data, imagen: profilePic }));
    setIsFlipped(false);
  };

  return (
    <div className="relative w-full perspective">
      <div
        className={`relative h-[900px] transition-transform duration-700 transform-style-3d ${
          isFlipped ? "rotate-y-180" : ""
        }`}
      >
        {/* Front Face */}
        <div className="absolute w-full h-full bg-white/50 dark:bg-gray-800/50 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 backdrop-blur-lg backdrop-filter backface-hidden">
          <h2 className="text-xl font-semibold mb-4 border-b border-b-custom-dark-blue dark:border-b-custom-light-gray pb-2 text-gray-800 dark:text-gray-200">
            {t("profileOverview")}
          </h2>
          <button
            type="button"
            onClick={handleEditClick}
            className="absolute top-3 right-2 p-2 text-custom-dark-blue dark:text-custom-yellow transition-colors"
            aria-label="Edit profile"
          >
            <FontAwesomeIcon icon={faPen} className="text-xl" />
          </button>
          <div className="flex flex-col items-center mb-8">
            <div className="relative w-48 h-48 my-4">
              <Image
                src={profilePic}
                alt="Profile"
                fill
                className="rounded-full border-4 border-custom-dark-blue dark:border-custom-yellow shadow-dark-shadow"
              />
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleProfilePicChange}
                className="hidden"
              />
            </div>
          </div>
          <div className="space-y-4 text-gray-700 dark:text-gray-300 mb-2">
            {/* Profile Info */}
            {[
              { label: t("name"), value: user?.nombre || "" },
              { label: t("surname"), value: user?.apellido || "" },
              { label: t("email"), value: user?.email || "" },
              { label: t("mobile"), value: user?.movil || "" },
              { label: t("company"), value: user?.company || "" },
              { label: t("userAdress"), value: user?.address || "" },
              { label: t("city"), value: user?.city || "" },
              { label: t("postcode"), value: user?.postcode || "" },
              { label: t("regionState"), value: user?.region || "" },
              { label: t("country"), value: user?.country || "" },
              { label: t("cifNif"), value: user?.cifNif || "" },
              {
                label: t("userStatus"),
                value: user?.clase
                  ? user.clase.charAt(0).toUpperCase() + user.clase.slice(1)
                  : "",
              },
            ].map((field, index) => (
              <p key={index} className="flex justify-between gap-2">
                <span className="block text-gray-500 dark:text-custom-dark-gray">
                  {field.label}:
                </span>
                <span className="text-custom-dark-blue dark:text-custom-yellow text-right">
                  {field.value || ""}
                </span>
              </p>
            ))}
          </div>
        </div>

        {/* Back Face - Edit Form */}
        <div className="absolute w-full h-full bg-white/30 dark:bg-gray-800/30 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 backdrop-blur-lg backdrop-filter backface-hidden rotate-y-180">
          <h2 className="text-xl font-semibold mb-4 border-b border-b-custom-dark-blue dark:border-b-custom-light-gray pb-2 text-gray-800 dark:text-gray-200">
            {t("editProfile")}
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
            {/* Form Fields */}
            <div className="flex flex-col items-center">
              <div className="relative w-48 h-48">
                <Image
                  src={profilePic}
                  alt="Profile"
                  fill
                  className="rounded-full border-4 border-custom-dark-blue dark:border-custom-yellow shadow-lg"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="group absolute backdrop-blur-lg backdrop-filter top-2 right-2 bg-custom-light-gray/90 dark:bg-custom-dark-blue p-2 rounded-full shadow-md border-4 border-custom-dark-blue dark:border-custom-yellow hover:bg-custom-dark-blue hover:dark:bg-custom-yellow transition-colors duration-300"
                  aria-label="Edit profile"
                >
                  <BiPencil className="text-2xl text-custom-dark-blue dark:text-custom-yellow group-hover:text-custom-light-gray group-hover:dark:text-custom-dark-blue transition-colors duration-300" />
                </button>

                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleProfilePicChange}
                  className="hidden"
                />
              </div>
            </div>
            <input
              type="text"
              defaultValue={user?.nombre}
              {...register("name")}
              className="w-full px-4 py-2 bg-gray-50/50 dark:bg-gray-900/50 text-gray-800 dark:text-custom-yellow border-b border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-custom-yellow transition"
              placeholder={t("name")}
              required
            />
            <input
              type="text"
              defaultValue={user?.apellido}
              {...register("surname")}
              className="w-full px-4 py-2 bg-gray-50/50 dark:bg-gray-900/50 text-gray-800 dark:text-custom-yellow border-b border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-custom-yellow transition"
              placeholder={t("surname")}
              required
            />
            <input
              type="email"
              defaultValue={user?.email}
              {...register("email")}
              className="w-full px-4 py-2 bg-gray-50/50 dark:bg-gray-900/50 text-gray-800 dark:text-custom-yellow border-b border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-custom-yellow transition"
              placeholder={t("email")}
              required
            />
            <PhoneInput
              country="es"
              defaultValue={user?.movil}
              onChange={(phone) => register("mobile").onChange(phone)}
              inputStyle={{
                width: "100%",
                background:
                  theme === "dark"
                    ? "rgb(17 24 39 / 0.5)"
                    : "rgb(249 250 251 / 0.5)",
                color: theme === "dark" ? "#FFD57A" : "#002C3F",
                border: "none",
                borderRadius: "4px 4px 0 0",
                borderBottom: "1px solid",
                borderBottomColor:
                  theme === "dark" ? "rgb(55 65 81)" : "#d1d5db ",
                paddingBlock: "0.5rem",
                height: "2.5rem",
                fontSize: "16px",
                fontFamily: "'Corbert', sans-serif",
              }}
              buttonStyle={{
                background:
                  theme === "dark"
                    ? "rgb(17 24 39 / 0.5)"
                    : "rgb(249 250 251 / 0.5)",
              }}
            />

            <input
              type="text"
              defaultValue={user?.company}
              {...register("company")}
              className="w-full px-4 py-2 bg-gray-50/50 dark:bg-gray-900/50 text-gray-800 dark:text-custom-yellow border-b border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-custom-yellow transition"
              placeholder={t("company")}
            />
            <input
              type="text"
              defaultValue={user?.address}
              {...register("address")}
              className="w-full px-4 py-2 bg-gray-50/50 dark:bg-gray-900/50 text-gray-800 dark:text-custom-yellow border-b border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-custom-yellow transition"
              placeholder={t("address")}
            />
            <input
              type="text"
              defaultValue={user?.city}
              {...register("city")}
              className="w-full px-4 py-2 bg-gray-50/50 dark:bg-gray-900/50 text-gray-800 dark:text-custom-yellow border-b border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-custom-yellow transition"
              placeholder={t("city")}
            />
            <input
              type="text"
              defaultValue={user?.postcode}
              {...register("postcode")}
              className="w-full px-4 py-2 bg-gray-50/50 dark:bg-gray-900/50 text-gray-800 dark:text-custom-yellow border-b border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-custom-yellow transition"
              placeholder={t("postcode")}
            />
            <input
              type="text"
              defaultValue={user?.region}
              {...register("region")}
              className="w-full px-4 py-2 bg-gray-50/50 dark:bg-gray-900/50 text-gray-800 dark:text-custom-yellow border-b border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-custom-yellow transition"
              placeholder={t("regionState")}
            />
            <input
              type="text"
              defaultValue={user?.country}
              {...register("country")}
              className="w-full px-4 py-2 bg-gray-50/50 dark:bg-gray-900/50 text-gray-800 dark:text-custom-yellow border-b border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-custom-yellow transition"
              placeholder={t("country")}
            />
            <input
              type="text"
              defaultValue={user?.cifNif}
              {...register("cifNif")}
              className="w-full px-4 py-2 bg-gray-50/50 dark:bg-gray-900/50 text-gray-800 dark:text-custom-yellow border-b border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-custom-yellow transition"
              placeholder={t("cifNif")}
            />
            <div className="flex mt-6 pt-4 justify-center">
              <PrimaryButton type="submit">{t("save")}</PrimaryButton>
              <SecondaryButton type="SecondaryB" onClick={handleCancelEdit}>
                {t("cancel")}
              </SecondaryButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileOverviewCard;
