"use client";

import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { selectIsAdmin } from "@/store/slices/userSlice";

const withAdminGuard = (WrappedComponent) => {
  return function AdminGuardedComponent(props) {
    const router = useRouter();
    const isAdmin = useSelector(selectIsAdmin);

    if (!isAdmin) {
      router.push("/unauthorized");
      return null;
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAdminGuard;
