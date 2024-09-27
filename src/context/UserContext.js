
import React, { createContext, useState, useEffect, useContext } from 'react';
import { getMyProfile, getUserProfile, updateUserProfileApi } from '../utils/api';
import { AuthContext } from './AuthContext';
import { toast } from 'react-toastify';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [meUserProfile, setMeUserProfile] = useState(null);
  const [otherUserProfile, setOtherUserProfile] = useState(null);

  const { token } = useContext(AuthContext); 

  // useEffect(() => {
  //   fetchMyProfile();
  //   }, []);

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
      const response = await getUserProfile(userId, token);
      setOtherUserProfile(response.data);
    } catch (error) {
      console.error('獲取用戶個人信息時出錯:', error);
    }
  };

  const updateUserProfile = async (updatedProfileString, updatedProfileInt) => {
    try {
      const response = await updateUserProfileApi(token, updatedProfileInt);
      setMeUserProfile((prevProfile) => ({
        ...prevProfile,
        ...updatedProfileString,
      }));
      toast.success('個人資料更新成功');
    } catch (error) {
      console.error('更新使用者資料失敗:', error);
      toast.error('更新失敗，請稍後再試');
    }
  };

  return (
    <UserContext.Provider
      value={{
        meUserProfile,
        otherUserProfile,
        fetchUserProfile,
        setMeUserProfile, // 導出 setMeUserProfile 以便後續更新
        updateUserProfile,
        setOtherUserProfile
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
