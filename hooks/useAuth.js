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
    console.log("Saving token:", user.tokenIdentificador);
    console.log("Full user object:", user);

    const cookieOptions = {
      expires: 180,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    };

    // Verify the token before setting
    if (!user.tokenIdentificador) {
      console.error("No token found to save");
      return;
    }

    Cookies.set("authToken", user.tokenIdentificador, cookieOptions);
    Cookies.set("user", JSON.stringify(user), cookieOptions);

    // Verify cookie was set
    const savedToken = Cookies.get("authToken");
    console.log("Saved token:", savedToken);
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
