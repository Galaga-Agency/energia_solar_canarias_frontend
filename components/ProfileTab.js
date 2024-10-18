"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, mockLogout } from "@/store/slices/userSlice";
import axios from "axios";
import { useTranslation } from "next-i18next";
import useLocalStorageState from "use-local-storage-state";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faPen } from "@fortawesome/free-solid-svg-icons";

const ProfileTab = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const avatarPlaceholder = "/assets/img/avatar.webp";
  const { t } = useTranslation();
  const [name, setName] = useState(user?.nombre);
  const [email, setEmail] = useState(user?.email);
  const [profilePic, setProfilePic] = useState(
    user?.imagen || avatarPlaceholder
  );
  const [editing, setEditing] = useState(false);
  const [theme] = useLocalStorageState("theme", { defaultValue: "dark" });
  const [loading, setLoading] = useState(false);

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
        profilePic,
      });
      setEditing(false); // Stop editing after update
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center ${
        theme === "dark"
          ? "bg-gray-900"
          : "bg-gradient-to-b from-gray-200 to-custom-dark-gray"
      } p-6 rounded-lg shadow-lg transition duration-300`}
    >
      <h2 className="text-4xl font-bold text-custom-yellow">Profile</h2>
      <p className="text-center text-custom-dark-gray mt-2">
        {t("viewEditProfile")}
      </p>

      <div className="flex flex-col items-center mb-6">
        <img
          src={profilePic}
          alt="Profile"
          className="w-32 h-32 rounded-full object-cover border-4 border-custom-yellow shadow-lg"
        />
        <label className="flex flex-col items-center cursor-pointer mt-2">
          <FontAwesomeIcon
            icon={faCamera}
            className="text-3xl text-custom-yellow mb-1"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
          <span className="text-custom-dark-blue font-semibold">
            {t("changePhoto")}
          </span>
        </label>
      </div>

      <form
        onSubmit={handleUpdateProfile}
        className="space-y-4 w-full max-w-md"
      >
        <div className="flex justify-between items-center">
          <div className="flex-grow">
            <label className="block mb-1 text-custom-dark-gray">
              {t("name")}
            </label>
            {editing ? (
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 border border-custom-yellow rounded-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-custom-yellow"
                required
              />
            ) : (
              <span className="text-lg font-semibold text-custom-dark-blue">
                {name}
              </span>
            )}
          </div>
          <button type="button" onClick={() => setEditing(!editing)}>
            <FontAwesomeIcon
              icon={faPen}
              className="text-custom-yellow text-xl"
            />
          </button>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex-grow">
            <label className="block mb-1 text-custom-dark-gray">
              {t("email")}
            </label>
            {editing ? (
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-custom-yellow rounded-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-custom-yellow"
                required
              />
            ) : (
              <span className="text-lg font-semibold text-custom-dark-blue">
                {email}
              </span>
            )}
          </div>
        </div>

        {editing && (
          <button
            type="submit"
            className={`w-full py-3 bg-custom-yellow text-custom-dark-blue rounded-lg transition duration-300 hover:bg-yellow-400 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? t("updating") : t("updateProfile")}
          </button>
        )}
      </form>

      <button
        onClick={() => dispatch(mockLogout())}
        className="mt-6 w-full py-2 text-red-500 hover:underline"
      >
        {t("logout")}
      </button>
    </div>
  );
};

export default ProfileTab;
