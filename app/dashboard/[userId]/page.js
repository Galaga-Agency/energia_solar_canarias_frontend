"use client";

import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { selectUser } from "@/store/slices/userSlice";
import Loading from "@/components/Loading";

const DashboardPage = ({ params }) => {
  const user = useSelector(selectUser);
  const router = useRouter();

  useEffect(() => {
    // Mock development login check
    if (!user || user.id !== "123") {
      router.push("/");
    }

    // Uncomment this when backend is ready
    /*
    if (!user || user.id !== params.userid) {
      router.push("/");
    }
    */
  }, [user, params.userid, router]);

  return (
    <div className="p-6">
      {user && user.id === "123" ? ( // For development, checks mock user
        <h1 className="text-2xl">Welcome, {user.name}!</h1>
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default DashboardPage;
