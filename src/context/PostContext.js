import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import {
  getUserPosts,
  getRecommendedPosts,
  deletePost as apiDeletePost,
  getPostDetail as apiGetPostDetail,
} from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { useNavigate, useLocation } from 'react-router-dom';

export const PostContext = createContext();

export const PostProvider = ({ children }) => {
  const { token, userId: currentUserId } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [mePosts, setMePosts] = useState([]);
  const [otherUserPosts, setOtherUserPosts] = useState([]);

  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (token) {
      reLoadPosts();
      fetchMyPosts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const loadPosts = useCallback(async () => {
    if (loading || !hasMore) return; // 確保不會重覆加載

    setLoading(true);
    try {
      const data = await getRecommendedPosts(token, page, 7); // 使用當前的 page 加載文章
      console.log('data', data);

      if (data.content.length > 0) {
        setPosts((prevPosts) => [...prevPosts, ...data.content]);
        setHasMore(!data.last); // 根據後端的回應來確定是否還有更多貼文
        setPage((prevPage) => prevPage + 1); // 更新狀態中的 page
      } else {
        setHasMore(false); // 如果沒有更多貼文，設置 hasMore 為 false
      }
    } catch (error) {
      console.error('後端錯誤:', error.message);
    } finally {
      setLoading(false); // 確保在所有情況下都會結束 loading 狀態
    }
  }, [token, page, hasMore, loading]);

  const reLoadPosts = useCallback(async () => {
    setLoading(true); // 加載前設置為 loading 狀態
    setPage(0);
    setHasMore(true);
    setPosts([]); // 清空現有的帖子

    try {
      const data = await getRecommendedPosts(token, 0, 7); // 加載第一頁的帖子
      if (data.content.length > 0) {
        setPosts(data.content);
        setHasMore(!data.last);
        setPage(1);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('後端錯誤:', error.message);
    } finally {
      setLoading(false); // 加載結束後取消 loading 狀態
    }
  }, [token]);

  const fetchMyPosts = async () => {
    try {
      const response = await getUserPosts(currentUserId, token);
      setMePosts(response.data);
    } catch (error) {
      console.error('獲取用戶貼文時出錯:', error);
    }
  };

  const fetchUserPostsData = async (userId) => {
    try {
      const response = await getUserPosts(userId, token);
      setOtherUserPosts(response.data);
    } catch (error) {
      console.error('獲取用戶貼文時出錯:', error);
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
      prevPosts.map((post) => (post.postId === updatedPost.postId ? updatedPost : post))
    );
    setMePosts((prevPosts) =>
      prevPosts.map((post) => (post.postId === updatedPost.postId ? updatedPost : post))
    );
  };

  const handlePostCreated = (newPost) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]);
    setMePosts((prevPosts) => [newPost, ...prevPosts]);
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
        reLoadPosts,
        getPostDetail,
        hasMore,
        loading,
        page
      }}
    >
      {children}
    </PostContext.Provider>
  );
};
