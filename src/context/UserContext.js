
import React, { createContext, useState, useEffect, useContext } from 'react';
import { getMyProfile, getUserProfile } from '../utils/api';
import { AuthContext } from './AuthContext';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [meUserProfile, setMeUserProfile] = useState(null);
  const [otherUserProfile, setOtherUserProfile] = useState(null);

  const { token } = useContext(AuthContext); 

  useEffect(() => {
    fetchMyProfile();
    }, []);

  useEffect(() => {
    if (token) {
      fetchMyProfile();
    }
  }, [token]);

  const fetchMyProfile = async () => {
    try {
      const response = await getMyProfile(token);
      setMeUserProfile(response.data);
    } catch (error) {
      console.error('獲取我的個人信息時出錯:', error);
    }
  };

  const fetchUserProfile = async (userId) => {
    try {
      const response = await getUserProfile(token, userId);
      setOtherUserProfile(response.data);
    } catch (error) {
      console.error('獲取用戶個人信息時出錯:', error);
    }
  };

  return (
    <UserContext.Provider
      value={{
        meUserProfile,
        otherUserProfile,
        fetchUserProfile,
        setMeUserProfile, // 導出 setMeUserProfile 以便後續更新
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
