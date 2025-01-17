import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { useTranslation } from "next-i18next";
import { UserPlus } from "lucide-react";
import UserAvatarChain from "./UserAvatarChain";
import ManageUsersModal from "./ManageUsersModal";
import {
  associatePlantToUser,
  dissociatePlantFromUser,
  fetchAssociatedUsers,
  selectAssociatedUsers,
} from "@/store/slices/plantsSlice";
import { selectUser } from "@/store/slices/userSlice";
import { useParams } from "next/navigation";
import { toast } from "sonner";

const AssociatedUsers = ({ isAdmin, plantId }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const associatedUsers = useSelector(selectAssociatedUsers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const user = useSelector(selectUser);
  const token = user?.tokenIdentificador;
  const { provider } = useParams();

  // Fetch associated users on mount if admin
  useEffect(() => {
    if (isAdmin && plantId && provider && token) {
      setIsLoading(true);
      dispatch(fetchAssociatedUsers({ plantId, provider, token })).finally(() =>
        setIsLoading(false)
      );
    }
  }, [dispatch, isAdmin, plantId, provider, token, associatedUsers]);

  const handleAddUser = (newUser) => {
    const { usuario_id: userId } = newUser;

    if (!plantId || !provider || !token || !userId) {
      console.error(
        "Missing required parameters for associating user to plant"
      );
      return;
    }

    dispatch(
      associatePlantToUser({
        userId,
        plantId,
        provider,
        token,
      })
    )
      .unwrap()
      .then(() => {
        dispatch(fetchAssociatedUsers({ plantId, provider, token }));
        console.log("User successfully associated with the plant");
      })
      .catch((error) => {
        console.error("Error associating user to plant:", error);
      });
  };

  const handleRemoveUser = (userId) => {
    if (!plantId || !provider || !token || !userId) {
      toast.error(t("missingParameters"));
      return;
    }

    // Dispatch the action and store the promise
    const dissociatePromise = dispatch(
      dissociatePlantFromUser({
        userId,
        plantId,
        provider,
        token,
      })
    ).unwrap();

    // Use toast.promise to track the promise state
    toast.promise(dissociatePromise, {
      loading: t("removingUser"),
      success: t("userRemovedSuccessfully"),
      error: (error) => error?.message || t("failedToRemoveUser"),
    });

    dissociatePromise
      .then(() => {
        dispatch(fetchAssociatedUsers({ plantId, provider, token }));
      })
      .catch((error) => {
        console.error("Error dissociating user:", error);
      });
  };

  if (!isAdmin) return null;

  return (
    <>
      <div className="relative bg-gradient-to-br from-white/90 to-white/50 dark:from-custom-dark-blue/90 dark:to-custom-dark-blue/50 p-6 rounded-xl shadow-md backdrop-blur-lg mb-6 overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-xl text-custom-dark-blue dark:text-custom-yellow">
                {t("associatedUsers")}
              </h2>
              {isLoading ? (
                <div className="text-gray-500">{t("loading")}</div>
              ) : associatedUsers.length > 0 ? (
                <UserAvatarChain users={associatedUsers} maxDisplay={10} />
              ) : (
                <div className="text-gray-500 italic">
                  {t("noAssociatedUsers")}
                </div>
              )}
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsModalOpen(true)}
              className="p-2 rounded-full bg-custom-yellow text-custom-dark-blue hover:bg-custom-yellow/80 transition-colors"
            >
              <UserPlus className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>

      <ManageUsersModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        users={associatedUsers}
        onAddUser={handleAddUser}
        onRemoveUser={handleRemoveUser}
        t={t}
      />
    </>
  );
};

export default AssociatedUsers;
