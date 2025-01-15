import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  setUser as setReduxUser,
  validateToken,
} from "@/store/slices/userSlice";
import Cookies from "js-cookie";

const useAuth = () => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const validateStoredAuth = async () => {
      const storedUser = Cookies.get("user");
      const storedToken = Cookies.get("authToken");

      if (storedUser && storedToken) {
        try {
          const parsedUser = JSON.parse(storedUser);
        } catch (error) {
          console.error(error);
        }
      } else {
        console.log("No existe sesión del usuario");
      }
    };

    validateStoredAuth();
  }, [dispatch]);

  const saveAuthData = (token, user) => {
    const cookieOptions = {
      expires: 180,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    };

    const userData = {
      ...user,
      tokenIdentificador: user.tokenIdentificador,
    };

    Cookies.set("authToken", user.tokenIdentificador, cookieOptions);
    Cookies.set("user", JSON.stringify(userData), cookieOptions);

    setToken(user.tokenIdentificador);
    setUser(userData);
    dispatch(setReduxUser(userData));
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
