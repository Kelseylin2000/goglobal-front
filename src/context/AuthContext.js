import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('accessToken'));
  const [userId, setUserId] = useState(localStorage.getItem('userId'));

  useEffect(() => {

    const handleStorageChange = () => {
      setToken(localStorage.getItem('accessToken'));
      setUserId(localStorage.getItem('userId'));
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const setAuth = (accessToken, userId) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('userId', userId);
    setToken(accessToken);
    setUserId(userId);
  };

  const removeAuth = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userId');
    setToken(null);
    setUserId(null);
  };

  return (
    <AuthContext.Provider value={{ token, userId, setAuth, removeAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
