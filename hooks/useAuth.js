import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { setUser as setReduxUser } from "@/store/slices/userSlice";

const useAuth = () => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const storedUser = Cookies.get("user");
    const storedToken = Cookies.get("authToken");

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      dispatch(setReduxUser(parsedUser));
    }

    if (storedToken) {
      setToken(storedToken);
    }
  }, [dispatch]);

  const saveAuthData = (token, user) => {
    // Set cookies with 180 days expiration
    Cookies.set("authToken", token, {
      expires: 180,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    Cookies.set("user", JSON.stringify(user), {
      expires: 180,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    setToken(token);
    setUser(user);
    dispatch(setReduxUser(user));
  };

  const clearAuthData = () => {
    Cookies.remove("authToken");
    Cookies.remove("user");
    setToken(null);
    setUser(null);
    dispatch(setReduxUser(null));
  };

  return { token, user, saveAuthData, clearAuthData };
};

export default useAuth;
