"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import {
  selectTokenValidated,
  selectIsLoggedIn,
  selectIsAdmin,
  selectUser,
} from "@/store/slices/userSlice";
import useAuth from "@/hooks/useAuth";

const AuthWrapper = ({ children }) => {
  const router = useRouter();
  const { token } = useAuth();
  const tokenValidated = useSelector(selectTokenValidated);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const isAdmin = useSelector(selectIsAdmin);
  const user = useSelector(selectUser);

  useEffect(() => {
    const publicPaths = ["/", "/forgot-password"];
    const currentPath = window.location.pathname;

    if (!token && !publicPaths.includes(currentPath)) {
      router.push("/");
    }

    if (token && !tokenValidated && !publicPaths.includes(currentPath)) {
      // If we have a token but it's not validated, redirect to login
      router.push("/");
    }

    if (token && tokenValidated && publicPaths.includes(currentPath)) {
      // If we're logged in and validated but on a public path, redirect to dashboard
      router.push(`/dashboard/${user?.id}`);
    }
  }, [token, tokenValidated, isLoggedIn, router]);

  return children;
};

export default AuthWrapper;
