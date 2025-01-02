import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { setUser as setReduxUser } from "@/store/slices/userSlice";

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

          // Validate token with your backend
          const response = await dispatch(
            validateToken({
              id: parsedUser.id,
              token: storedToken,
            })
          ).unwrap();

          if (response.status === true) {
            setUser(response.data);
            setToken(storedToken);
            dispatch(setReduxUser(response.data));
          } else {
            // If token is invalid, clear everything
            clearAuthData();
          }
        } catch (error) {
          clearAuthData();
        }
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
      domain: window.location.hostname,
    };

    Cookies.set("authToken", token, cookieOptions);
    Cookies.set("user", JSON.stringify(user), cookieOptions);

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
