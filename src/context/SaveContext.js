import React, { createContext, useState, useEffect, useContext } from 'react';
import {
  getSavedPosts as apiGetSavedPosts,
  savePost as apiSavePost,
  unsavePost as apiUnsavePost,
} from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

export const SaveContext = createContext();

export const SaveProvider = ({ children }) => {
  const {token} = useContext(AuthContext);
  const [savedPostIds, setSavedPostIds] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);

  useEffect(() => {
    loadSavedPosts();
  }, [token]);


  const loadSavedPosts = () => {
    apiGetSavedPosts(token)
      .then((data) => {
        setSavedPostIds(data.data.map((post) => post.postId));
        setSavedPosts(data.data);
      })
      .catch((error) => {
        console.error('獲取收藏列表時出錯:', error.message);
      });
  };

  const isPostSaved = (postId) => savedPostIds.includes(postId);

  const handleSave = (postId) => {
    apiSavePost(postId, token)
      .then(() => {
        loadSavedPosts();
        toast.success("已收藏貼文");
      })
      .catch((error) => {
        console.error('後端錯誤:', error.message);
      });
  };

  const handleUnsave = (postId) => {
    apiUnsavePost(postId, token)
      .then(() => {
        setSavedPostIds((prevIds) => prevIds.filter((id) => id !== postId));
        setSavedPosts((prevPosts) => prevPosts.filter((post) => post.postId !== postId));
        toast.success("已取消收藏貼文");
      })
      .catch((error) => {
        console.error('取消收藏時出錯:', error.message);
      });
  };

  const handleSavedPostUpdated = (updatedPost) => {
    setSavedPosts((prevSavedPosts) =>
      prevSavedPosts.map((post) =>
        post.postId === updatedPost.postId ? updatedPost : post
      )
    );
  };

  const toggleSavedPostsModal = () => {
    setIsSavedModalOpen(!isSavedModalOpen);
  };

  return (
    <SaveContext.Provider
      value={{
        savedPosts,
        isPostSaved,
        handleSave,
        handleUnsave,
        isSavedModalOpen,
        handleSavedPostUpdated,
        toggleSavedPostsModal,
        setIsSavedModalOpen
      }}
    >
      {children}
    </SaveContext.Provider>
  );
};