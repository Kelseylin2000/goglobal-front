// src/pages/PostPage.js
import React, { useEffect, useContext, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import PostDetail from '../components/PostDetail';
import EditPostModal from '../components/EditPostModal';
import LoadingSpinner from '../components/LoadingSpinner';
import { PostContext } from '../context/PostContext';
import { SaveContext } from '../context/SaveContext';
import SavedPostsModal from '../components/SavedPostsModal';
import { AuthContext } from '../context/AuthContext';

const PostPage = () => {
  const {userId} = useContext(AuthContext);

  const { postId } = useParams();
  const navigate = useNavigate();
  const { getPostDetail, handlePostUpdated} = useContext(PostContext);
  const { handleSavedPostUpdated, isSavedModalOpen, savedPosts, toggleSavedPostsModal} = useContext(SaveContext);

  const [post, setPost] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // 載入貼文詳情
  const loadPostDetail = () => {
    getPostDetail(postId)
      .then((data) => {
        setPost(data.data);
      })
      .catch((error) => {
        console.error('後端錯誤:', error.message);
      })
  };

  useEffect(() => {
    loadPostDetail();
  }, [postId]);

  const navigateBack = () => {
    navigate('/');
  };

  const onPostUpdated = (updatedPost) => {
    handlePostUpdated(updatedPost);
    loadPostDetail(); // 更新完後重新載入貼文詳情
  };

  return (
    <>
      {/* <Header /> */}
      <main>
        {!post ? (
          <LoadingSpinner />
        ) : (
          <PostDetail
            post={post}
            userId={userId}
            navigateBack={navigateBack}
            loadPostDetail={loadPostDetail}
          />
        )}
      </main>
      {isEditModalOpen && (
        <EditPostModal
          post={post}
          onClose={() => setIsEditModalOpen(false)}
          onPostUpdated={onPostUpdated}
          handleSavedPostUpdated={handleSavedPostUpdated}
        />
      )}
      {isSavedModalOpen && (
        <SavedPostsModal
          savedPosts={savedPosts}
          toggleSavedPostsModal={toggleSavedPostsModal}
          userId={userId}
        />
      )}
    </>
  );
};

export default PostPage;
