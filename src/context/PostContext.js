import React, { createContext, useState, useEffect, useContext } from 'react';
import {
  getUserPosts,
  getRecommendedPosts,
  deletePost as apiDeletePost,
  getPostDetail as apiGetPostDetail
} from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { useNavigate, useLocation } from 'react-router-dom';

export const PostContext = createContext();

export const PostProvider = ({ children }) => {
  const {token, userId: currentUserId } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [mePosts, setMePosts] = useState([]);
  const [otherUserPosts, setOtherUserPosts] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    loadPosts();
    fetchMyPosts();
  }, [token]);

  const loadPosts = async () => {
    try {
      const data = await getRecommendedPosts(token);
      setPosts(data.content);
    } catch (error) {
      console.error('後端錯誤:', error.message);
    }
  };  

  const fetchMyPosts = async () => {
    const response = await getUserPosts(currentUserId, token);
    setMePosts(response.data);
  };

  const fetchUserPostsData = async (userId) => {
    try {
      const response = await getUserPosts(userId, token);
      setOtherUserPosts(response.data);
    } catch (error) {
      console.error('獲取用戶 post 時出錯:', error);
    }
  };

  const handleDelete = (postId) => {
    if (window.confirm('你確定要刪除這篇貼文嗎？')) {
      apiDeletePost(postId, token)
        .then(() => {
          toast.success('貼文已刪除！');
          setPosts((prevPosts) => prevPosts.filter((post) => post.postId !== postId));
          setMePosts((prevPosts) => prevPosts.filter((post) => post.postId !== postId));

          if (location.pathname.includes('/post/')) {
            navigate(-1);
          }
        })
        .catch((error) => {
          console.error('刪除貼文時出錯:', error.message);
        });
    }
  };

  const handlePostUpdated = (updatedPost) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.postId === updatedPost.postId ? updatedPost : post
      )
    );
    setMePosts((prevPosts) =>
      prevPosts.map((post) =>
        post.postId === updatedPost.postId ? updatedPost : post
      )
    );
  };

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
    setMePosts([newPost, ...mePosts]);
  };

  const getPostDetail = (postId) => {
    return apiGetPostDetail(postId, token);
  };

  return (
    <PostContext.Provider
      value={{ 
        posts, 
        mePosts,
        otherUserPosts,
        setMePosts,
        setOtherUserPosts,
        fetchUserPostsData,
        setPosts, 
        handleDelete, 
        handlePostUpdated,
        handlePostCreated,
        loadPosts, 
        getPostDetail 
      }}
    >
      {children}
    </PostContext.Provider>
  );
};
