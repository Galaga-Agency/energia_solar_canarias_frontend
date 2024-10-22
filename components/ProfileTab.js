"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, logoutUser } from "@/store/slices/userSlice";
import axios from "axios";
import { useTranslation } from "next-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faPen,
  faSave,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import companyIcon from "@/public/assets/icons/icon-512x512.png";
import Image from "next/image";
import { FiUpload } from "react-icons/fi";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import useLocalStorageState from "use-local-storage-state";

const ProfileTab = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const avatarPlaceholder = "/assets/img/avatar.webp";
  const { t } = useTranslation();

  const [name, setName] = useState(user?.nombre);
  const [surname, setSurname] = useState(user?.apellido);
  const [email, setEmail] = useState(user?.email);
  const [mobile, setMobile] = useState(user?.movil);
  const [clase] = useState(
    user?.clase.charAt(0).toUpperCase() + user?.clase.slice(1)
  );
  const [profilePic, setProfilePic] = useState(
    user?.imagen || avatarPlaceholder
  );
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [apiKeyRequested, setApiKeyRequested] = useState(false);
  const router = useRouter();
  const [theme] = useLocalStorageState("theme", { defaultValue: "dark" });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put("/api/update-profile", {
        name,
        email,
        mobile,
        profilePic,
      });
      setEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    Cookies.remove("user");
    router.push("/");
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      await axios.put("/api/change-password", { newPassword });
      alert(t("passwordChangeSuccess")); // Notify user
    } catch (error) {
      console.error("Error changing password:", error);
    }
  };

  const handleRequestApiKey = async () => {
    try {
      await axios.post("/api/request-api-key");
      setApiKeyRequested(true);
    } catch (error) {
      console.error("Error requesting API key:", error);
    }
  };

  return (
    <div className="relative p-8 md:p-10 h-full min-h-screen flex flex-col items-center pb-24 lg:pb-36">
      <div className="absolute bottom-0 -right-[50%] md:-right-[30%] lg:-right-[20%] xl:-right-[15%] md:bottom-12 z-0 flex items-center justify-center">
        <FontAwesomeIcon
          icon={faUser}
          className="text-custom-dark-gray dark:custom-dark-blue opacity-40 dark:opacity-10 text-[110vw] md:text-[90vw] lg:text-[50vw] xl:text-[40vw]"
        />
      </div>
      <div className="flex items-center mb-10 justify-start w-full z-10">
        <Image
          src={companyIcon}
          alt="Company Icon"
          className="w-12 h-12 mr-2"
        />
        <h2 className="text-4xl dark:text-custom-yellow text-custom-dark-blue">
          {t("profile")}
        </h2>
      </div>
      <div className="flex flex-col items-center mb-6 z-30">
        <img
          src={profilePic}
          alt="Profile"
          className="w-32 h-32 rounded-full object-cover border-4 border-custom-dark-blue dark:border-custom-yellow shadow-dark-shadow"
        />
        <label className="relative flex flex-col items-center cursor-pointer mt-2">
          {editing && (
            <FiUpload className="absolute -top-[30px] -right-16 text-2xl dark:text-custom-yellow text-custom-dark-blue mb-1" />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </label>
      </div>

      <div className="relative h-full w-full md:max-w-[50vw] lg:max-w-[45vw] xl:max-w-[25vw] bg-custom-dark-gray bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-30 p-6 pt-16 -mt-24 z-10 rounded-lg shadow-dark-shadow">
        <form
          onSubmit={handleUpdateProfile}
          className="space-y-4 w-full max-w-md"
        >
          <div className="flex justify-between items-center w-full">
            <div className="flex-grow">
              <label className="block mb-1 text-gray-500 dark:text-custom-dark-gray">
                {t("name")}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={!editing}
                className={`pb-1 w-full text-custom-dark-blue dark:text-custom-yellow border-b bg-transparent text-lg focus:outline-none transition duration-600 ${
                  editing
                    ? "border-custom-dark-blue dark:border-custom-yellow"
                    : "cursor-not-allowed border-transparent"
                }`}
                required
              />
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex-grow">
              <label className="block mb-1 text-gray-500 dark:text-custom-dark-gray">
                {t("surname")}
              </label>
              <input
                type="text"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                disabled={!editing}
                className={`pb-1 w-full text-custom-dark-blue dark:text-custom-yellow border-b bg-transparent text-lg focus:outline-none transition duration-600 ${
                  editing
                    ? "border-custom-dark-blue dark:border-custom-yellow"
                    : "cursor-not-allowed border-transparent"
                }`}
                required
              />
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex-grow">
              <label className="block mb-1 text-gray-500 dark:text-custom-dark-gray">
                {t("email")}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={!editing}
                className={`pb-1 w-full text-custom-dark-blue dark:text-custom-yellow border-b bg-transparent text-lg focus:outline-none transition duration-600 ${
                  editing
                    ? "border-custom-dark-blue dark:border-custom-yellow"
                    : "cursor-not-allowed border-transparent"
                }`}
                required
              />
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex-grow">
              <label className="block mb-1 text-gray-500 dark:text-custom-dark-gray">
                {t("mobile")}
              </label>
              <PhoneInput
                country="es"
                value={mobile}
                onChange={(phone) => setMobile(phone)}
                disabled={!editing}
                inputStyle={{
                  width: "100%",
                  border: "none",
                  borderBottom: editing
                    ? theme === "dark"
                      ? "1px solid rgb(255, 213, 122)"
                      : "1px solid rgb(0, 44, 63)"
                    : "none",
                  background: "transparent",
                  fontSize: "16px",
                  borderRadius: 0,
                  color:
                    theme === "dark" ? "rgb(255, 213, 122)" : "rgb(0, 44, 63)",
                }}
                buttonStyle={{
                  border: "none",
                  outline: "none",
                  background: "transparent",
                }}
              />
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex-grow">
              <label className="block mb-1 text-gray-500 dark:text-custom-dark-gray">
                {t("clase")}
              </label>
              <input
                type="text"
                value={clase}
                readOnly
                className="pb-1 border-b border-gray-300 cursor-not-allowed w-full text-custom-dark-blue dark:text-custom-yellow border-transparent bg-transparent text-lg focus:outline-none transition duration-600"
              />
            </div>
          </div>
        </form>

        <button
          type="button"
          onClick={() => setEditing(!editing)}
          className="absolute top-4 right-4"
        >
          <FontAwesomeIcon
            icon={editing ? faSave : faPen}
            className="custom-dark-blue dark:text-custom-yellow text-xl transition duration-600"
          />
        </button>
      </div>

      {/* Administration Section */}
      <div className="relative h-full w-full md:max-w-[50vw] lg:max-w-[45vw] xl:max-w-[25vw] bg-custom-dark-gray bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-30 p-6 pt-16 z-10 rounded-lg shadow-dark-shadow my-4">
        <h3 className="text-lg text-center text-custom-dark-blue dark:text-custom-yellow mb-4">
          {t("adminSection")}
        </h3>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block mb-1 text-gray-500 dark:text-custom-dark-gray">
              {t("newPassword")}
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="pb-1 w-full text-custom-dark-blue dark:text-custom-yellow border-b bg-transparent text-lg focus:outline-none transition duration-600 border-custom-dark-blue dark:border-custom-yellow"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-custom-yellow text-custom-dark-blue px-4 py-2 rounded-lg"
          >
            {t("changePassword")}
          </button>
        </form>
        <button
          onClick={handleRequestApiKey}
          className="bg-custom-yellow text-custom-dark-blue px-4 py-2 rounded-lg mt-4"
        >
          {t("requestApiKey")}
        </button>
      </div>

      {/* Company Documents Section */}
      <div className="relative h-full w-full md:max-w-[50vw] lg:max-w-[45vw] xl:max-w-[25vw] bg-custom-dark-gray bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-30 p-6 pt-16 z-10 rounded-lg shadow-dark-shadow my-4">
        <h3 className="text-lg text-center text-custom-dark-blue dark:text-custom-yellow mb-4">
          {t("companyDocuments")}
        </h3>
        <ul className="space-y-2">
          <li>
            <a
              href="https://www.energiasolarcanarias.es/politica-de-cookies"
              className="text-blue-300 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("cookiesPolicy")}
            </a>
          </li>
          <li>
            <a
              href="https://www.energiasolarcanarias.es/politica-de-privacidad"
              className="text-blue-300 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("privacyPolicy")}
            </a>
          </li>
          <li>
            <a
              href="https://www.energiasolarcanarias.es/aviso-legal"
              className="text-blue-300 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("legalNotice")}
            </a>
          </li>
        </ul>
      </div>

      <div className="flex justify-center items-center mt-8">
        <button
          onClick={handleLogout}
          className="py-2 text-red-500 hover:underline font-secondary text-lg"
        >
          {t("logout")}
        </button>
      </div>
    </div>
  );
};

export default ProfileTab;
