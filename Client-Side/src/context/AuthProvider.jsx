import { createContext, useContext, useState } from "react";
import { BASE_URL } from "../helpers/settings";

const AuthContext = createContext("");

export const useAuthContext = () => {
  return useContext(AuthContext);
};

function AuthProvider({ children }) {
  const [authUser, setAuthUser] = useState(
    JSON.parse(localStorage.getItem("user"))?.data?.user || null
  );
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email, password) => {
    try {
      setIsLoading(true);
      const state = { email, password };

      const res = await fetch(`${BASE_URL}/api/v1/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(state),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      localStorage.setItem("user", JSON.stringify(data));
      setAuthUser(data?.data?.user);
    } catch (err) {
      console.error(err);
      throw new Error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (state, dispatch) => {
    try {
      setIsLoading(true);
      const res = await fetch(`${BASE_URL}/api/v1/users/signup`, {
        method: "POST",
        body: state,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      localStorage.setItem("user", JSON.stringify(data));
      setAuthUser(data?.data?.user);

      // Reset the form state
      dispatch({ type: "reset" });
    } catch (err) {
      console.error(err);
      throw new Error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    setAuthUser(null);
  };

  const authInfo = {
    authUser,
    setAuthUser,
    login,
    signup,
    isLoading,
    logout,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
}

export default AuthProvider;
