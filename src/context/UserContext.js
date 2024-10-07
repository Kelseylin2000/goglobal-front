import React, { createContext, useState, useEffect, useContext } from 'react';
import { 
  getMyProfile, 
  getUserProfile, 
  updateUserProfileApi, 
  getUsersFromOrToSameSchool,
  updateInterestedSchools,
  deleteAllInterestedSchools,
  updateUserPhase,
  updateUserExchangeSchool,
  updateUserOriginSchool,
  deleteUserExchangeSchool
} from '../utils/api';
import { AuthContext } from './AuthContext';
import { toast } from 'react-toastify';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [meUserProfile, setMeUserProfile] = useState(null);
  const [otherUserProfile, setOtherUserProfile] = useState(null);
  const [sameSchoolUserProfiles, setSameSchoolUserProfiles] = useState(null);

  const { token } = useContext(AuthContext); 

  useEffect(() => {
    if (token) {
      fetchMyProfile();
      fetchSameSchoolUserProfiles();
    }
  }, [token]);

  const fetchMyProfile = async () => {
    try {
      const response = await getMyProfile(token);
      setMeUserProfile(response.data);
    } catch (error) {
      console.error('獲取我的個人訊息時出錯:', error);
    }
  };

  const fetchUserProfile = async (userId) => {
    try {
      const response = await getUserProfile(userId, token);
      setOtherUserProfile(response.data);
    } catch (error) {
      console.error('獲取用戶個人訊息時出錯:', error);
    }
  };

  const fetchSameSchoolUserProfiles = async () => {
    try {
      const response = await getUsersFromOrToSameSchool(token);
      setSameSchoolUserProfiles(response.data);
    } catch (error) {
      console.error('獲取同校夥伴時出錯:', error);
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

  const handleUpdateInterestedSchools = async (schoolIds, schoolNames) => {
    try {
      await updateInterestedSchools(token, schoolIds);
      setMeUserProfile((prevProfile) => ({
        ...prevProfile,
        interestedSchools: schoolNames,
      }));
      fetchSameSchoolUserProfiles();
    } catch (error) {
      console.error('更新興趣學校時出錯:', error);
      toast.error('興趣學校更新失敗，請稍後再試');
    }
  };

  const handleDeleteAllInterestedSchools = async () => {
    try {
      await deleteAllInterestedSchools(token);
      setMeUserProfile((prevProfile) => ({
        ...prevProfile,
        interestedSchools: [],
      }));
      fetchSameSchoolUserProfiles();
    } catch (error) {
      console.error('刪除興趣學校失敗:', error);
      toast.error('刪除興趣學校失敗，請稍後再試');
    }
  };

  const handleDeleteUserExchangeSchool = async () => {
    try {
      await deleteUserExchangeSchool(token);
      setMeUserProfile((prevProfile) => ({
        ...prevProfile,
        exchangeSchoolName: '',
      }));
      fetchSameSchoolUserProfiles();
    } catch (error) {
      console.error('刪除目的學校失敗:', error);
      toast.error('刪除目的學校失敗，請稍後再試');
    }
  };

  const handleUpdateUserPhase = async (phase) => {
    try {
      await updateUserPhase(token, phase);
      setMeUserProfile((prevProfile) => ({
        ...prevProfile,
        phase,
      }));
      toast.success('階段更新成功');
    } catch (error) {
      console.error('更新使用者階段失敗:', error);
      toast.error('更新階段失敗，請稍後再試');
    }
  };

  const handleUpdateUserExchangeSchool = async (schoolId, schoolName) => {
    try {
      await updateUserExchangeSchool(token, schoolId);
      setMeUserProfile((prevProfile) => ({
        ...prevProfile,
        exchangeSchoolName: schoolName,
      }));
      fetchSameSchoolUserProfiles();
    } catch (error) {
      console.error('更新目的學校失敗:', error);
      toast.error('更新目的學校失敗，請稍後再試');
    }
  };

  const handleUpdateUserOriginSchool = async (schoolId, schoolName) => {
    try {
      await updateUserOriginSchool(token, schoolId);
      setMeUserProfile((prevProfile) => ({
        ...prevProfile,
        originSchoolName: schoolName,
      }));
    } catch (error) {
      console.error('更新原學校失敗:', error);
      toast.error('更新原學校失敗，請稍後再試');
    }
  };

  return (
    <UserContext.Provider
      value={{
        meUserProfile,
        otherUserProfile,
        sameSchoolUserProfiles,
        setSameSchoolUserProfiles,
        fetchUserProfile,
        setMeUserProfile, 
        updateUserProfile,
        setOtherUserProfile,
        handleUpdateInterestedSchools,
        handleDeleteAllInterestedSchools,
        handleUpdateUserPhase,
        handleUpdateUserExchangeSchool,
        handleUpdateUserOriginSchool,
        handleDeleteUserExchangeSchool
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
