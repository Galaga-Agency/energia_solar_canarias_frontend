"use client";

import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { selectIsAdmin, selectUser } from "@/store/slices/userSlice";
import Loading from "@/components/Loading";

export default function Dashboard() {
  const router = useRouter();
  const isAdmin = useSelector(selectIsAdmin);
  const user = useSelector(selectUser);

  console.log("current user: ", user);

  // Redirect based on user role
  if (isAdmin) {
    router.push(`/dashboard/${user.id}/admin`);
  } else {
    router.push(`/dashboard/${user.id}/plants`);
  }

  return (
    <div className="h-screen w-screen">
      <Loading />
    </div>
  );
}
