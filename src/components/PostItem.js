import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import EditPostModal from './EditPostModal';
import { SaveContext } from '../context/SaveContext';
import { PostContext } from '../context/PostContext';

const PostItem = ({ post, userId, handleUploadInDetails = null }) => {

    const { isPostSaved, handleSave, handleUnsave, handleSavedPostUpdated, setIsSavedModalOpen} = useContext(SaveContext);
    const { handleDelete, handlePostUpdated} = useContext(PostContext);

  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);

  // 打開編輯模態框
  const openEditModal = (post) => {
    setCurrentPost(post);
    setIsEditModalOpen(true);
  };

  // 關閉編輯模態框
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setCurrentPost(null);
  };

  // 刪除貼文
  const deletePost = (postId) => {
    handleDelete(postId);
  };

  return (
    <>
        <div className="post" onClick={() => {
            setIsSavedModalOpen(false); 
            navigate(`/post/${post.postId}`); 
        }}>
        <div className="post-header">
          <img
            src={`https://i.pravatar.cc/200?u=${post.userId}`}
            alt="Avatar"
          />
          <div className="author-info">
            <h3>{post.name}</h3>
            <p>{new Date(post.createdAt).toLocaleString()}</p>
          </div>
        </div>
        <div className="post-content">{post.content}</div>
        <div className="post-tags">
          {post.tags && post.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        {post.images && post.images.length > 0 && (
          <div className="post-images">
            {post.images.map((img, index) => (
              <img key={index} src={img} alt="Post Image" />
            ))}
          </div>
        )}
        <div className="post-actions" onClick={(e) => e.stopPropagation()}>
        {post.userId == userId && (
            <>
              <button onClick={() => deletePost(post.postId)}>
                <img src="/img/delete.png" alt="刪除" />
              </button>
              <button onClick={() => openEditModal(post)}>
                <img src="/img/edit.png" alt="編輯" />
              </button>
            </>
          )}
          <button
            onClick={() =>
              isPostSaved(post.postId) ? handleUnsave(post.postId) : handleSave(post.postId)
            }
          >
            <img
              src={isPostSaved(post.postId) ? '/img/saved.png' : '/img/unSaved.png'}
              alt={isPostSaved(post.postId) ? '取消收藏' : '收藏'}
            />
          </button>
        </div>
      </div>

      {isEditModalOpen && (
        <EditPostModal
          post={currentPost}
          onClose={closeEditModal}
          onPostUpdated={handlePostUpdated}
          handleSavedPostUpdated={handleSavedPostUpdated}
          handleUploadInDetails={handleUploadInDetails}
        />
      )}
    </>
  );
};

export default PostItem;