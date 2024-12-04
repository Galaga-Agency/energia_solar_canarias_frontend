"use client";
import Loading from "./ui/Loading";
import { useSelector } from "react-redux";
import { selectTheme } from "@/store/slices/themeSlice";

const LoadingWrapper = () => {
  const theme = useSelector(selectTheme);
  return <Loading theme={theme} />;
};

export default LoadingWrapper;
