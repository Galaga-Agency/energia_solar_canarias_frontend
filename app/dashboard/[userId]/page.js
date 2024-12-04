"use client";

import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { selectIsAdmin, selectUser } from "@/store/slices/userSlice";
import Loading from "@/components/ui/Loading";
import { useEffect } from "react";
import { clearPlantDetails } from "@/store/slices/plantsSlice";

export default function Dashboard() {
  const router = useRouter();
  const isAdmin = useSelector(selectIsAdmin);
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  console.log("current user: ", user);

  useEffect(() => {
    if (user) {
      if (isAdmin) {
        router.push(`/dashboard/${user.id}/admin`);
      } else {
        router.push(`/dashboard/${user.id}/plants`);
      }
    }
  }, [isAdmin, user, router]);

  useEffect(() => {
    dispatch(clearPlantDetails());
  }, [dispatch]);

  return (
    <div className="h-screen w-screen">
      <Loading />
    </div>
  );
}
