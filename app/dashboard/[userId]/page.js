"use client";

import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { selectIsAdmin, selectUser } from "@/store/slices/userSlice";
import Loading from "@/components/Loading";
import { useEffect } from "react";
import { clearPlantDetails } from "@/store/slices/plantsSlice";

export default function Dashboard() {
  const router = useRouter();
  const isAdmin = useSelector(selectIsAdmin);
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  console.log("current user: ", user);

  // Redirect based on user role
  if (isAdmin) {
    router.push(`/dashboard/${user.id}/admin`);
  } else {
    router.push(`/dashboard/${user.id}/plants`);
  }

  useEffect(() => {
    dispatch(clearPlantDetails());
  }, []);

  return (
    <div className="h-screen w-screen">
      <Loading />
    </div>
  );
}
