"use client";

import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { selectIsAdmin, selectUser } from "@/store/slices/userSlice";
import Loading from "@/components/ui/Loading";
import { useEffect, useState } from "react";
import { clearPlantDetails } from "@/store/slices/plantsSlice";
import { selectTheme } from "@/store/slices/themeSlice";

export default function Dashboard() {
  const router = useRouter();
  const isAdmin = useSelector(selectIsAdmin);
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const theme = useSelector(selectTheme);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Clear plant details on mount
    dispatch(clearPlantDetails());

    // Add a small delay to ensure Redux state is fully loaded
    const checkAuthTimer = setTimeout(() => {
      if (!user) {
        router.replace("/");
      } else {
        const targetPath = isAdmin
          ? `/dashboard/${user.id}/admin`
          : `/dashboard/${user.id}/plants`;
        router.replace(targetPath);
      }
      setIsChecking(false);
    }, 500);

    return () => clearTimeout(checkAuthTimer);
  }, [user, isAdmin, router, dispatch]);

  // Show loading while checking auth
  if (isChecking) {
    return (
      <div className="h-screen w-screen">
        <Loading theme={theme} />
      </div>
    );
  }

  return null;
}
