"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { selectUser } from "@/store/slices/userSlice";
import Loading from "@/components/ui/Loading";

const AuthWrapper = ({ children }) => {
  const router = useRouter();
  const user = useSelector(selectUser);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check if the current path is public
    const isPublicPath = window.location.pathname === "/";

    if (!user && !isPublicPath) {
      router.replace("/");
    }

    // Small delay to prevent flash of content
    const timer = setTimeout(() => {
      setIsChecking(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [user, router]);

  if (isChecking) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return children;
};

export default AuthWrapper;
