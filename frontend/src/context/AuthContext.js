import React, { createContext, useContext, useState } from "react";
import jwtDecode from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const stored = localStorage.getItem("token");
  const [token, setToken] = useState(stored);
  const [user, setUser] = useState(stored ? jwtDecode(stored) : null);

  const login = (tk) => {
    localStorage.setItem("token", tk);
    setToken(tk);
    setUser(jwtDecode(tk));
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
