import { useContext, useEffect, useState } from "react";
import userAuthContext from "./userAuthContext";
import loginStatus from "../services/loginStatus";

export default function UserAuthContextProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const [navLoading, setNavLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [user, setUser] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [title,setTitle] = useState("")

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setNavLoading(true)
        const response = await loginStatus();
        if (response.data.authenticated) {
          setIsAuthenticated(true);
          setUser(response.data.user);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
        setNavLoading(false)
      }
    };

    checkAuth();
  }, []);
 
  return (
    <userAuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        loading,
        setLoading,
        user,
        setUser,
        questions,
        setQuestions,
        navLoading,
        setNavLoading,
        title,
        setTitle
      }}
    >
      {children}
    </userAuthContext.Provider>
  );
}

export function useUserAuth() {
  return useContext(userAuthContext);
}
