import React, { createContext, useState, useEffect, useContext } from 'react';
import {
  getRecommendedPosts,
  deletePost as apiDeletePost,
  editPost as apiEditPost,
  getPostDetail as apiGetPostDetail
} from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

export const PostContext = createContext();

export const PostProvider = ({ children }) => {
  const {token} = useContext(AuthContext);
  const [posts, setPosts] = useState([]);

  // useEffect(() => {
  //   loadPosts();
  // }, []);

  useEffect(() => {
    loadPosts();
  }, [token]);

  const loadPosts = () => {
    getRecommendedPosts(token)
      .then((data) => {
        setPosts(data.content);
      })
      .catch((error) => {
        console.error('後端錯誤:', error.message);
      });
  };

  const handleDelete = (postId) => {
    if (window.confirm('你確定要刪除這篇貼文嗎？')) {
      apiDeletePost(postId, token)
        .then(() => {
          toast.success('貼文已刪除！');
          setPosts((prevPosts) => prevPosts.filter((post) => post.postId !== postId));
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
  };

  const getPostDetail = (postId) => {
    return apiGetPostDetail(postId, token);
  };
  

  return (
    <PostContext.Provider
      value={{ posts, setPosts, handleDelete, handlePostUpdated, loadPosts, getPostDetail }}
    >
      {children}
    </PostContext.Provider>
  );
};
