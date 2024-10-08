import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import EditPostModal from './EditPostModal';
import { SaveContext } from '../context/SaveContext';
import { PostContext } from '../context/PostContext';
import { phaseMapping } from '../utils/constants';
import { translateText } from '../utils/api';

const PostItem = ({ post, userId, handleUploadInDetails = null }) => {
  const { isPostSaved, handleSave, handleUnsave, handleSavedPostUpdated, setIsSavedModalOpen } = useContext(SaveContext);
  const { handleDelete, handlePostUpdated } = useContext(PostContext);

  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  const [translatedContent, setTranslatedContent] = useState(''); // 保存翻譯內容
  const [isTranslating, setIsTranslating] = useState(false); // 翻譯狀態
  const [showOriginal, setShowOriginal] = useState(true); // 是否顯示原文

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

  // 處理翻譯請求
  const handleTranslate = async () => {
    if (!translatedContent) {
      // 如果還沒有翻譯，進行翻譯
      setIsTranslating(true);
      try {
        const translatedText = await translateText(post.content);
        setTranslatedContent(translatedText); // 保存翻譯結果
        setShowOriginal(false); // 切換到翻譯文本
      } catch (error) {
        console.error('翻譯失敗:', error);
      } finally {
        setIsTranslating(false);
      }
    } else {
      // 如果已經有翻譯了，切換顯示
      setShowOriginal(!showOriginal);
    }
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
            onClick={(e) => {
              e.stopPropagation(); // 阻止事件冒泡
              setIsSavedModalOpen(false); 
              navigate(`/user/${post.userId}`);
            }}
          />
          <div className="author-info" onClick={(e) => {
            e.stopPropagation();
            setIsSavedModalOpen(false);
            navigate(`/user/${post.userId}`);
          }}>
            <h3>{post.name}</h3>
            <div className="profile-details">
              <p className="phase">{post.phase ? phaseMapping[post.phase] : '未設定階段'}</p>
              {['APPLYING', 'ADMITTED', 'STUDYING_ABROAD', 'RETURNED'].includes(post.phase) && (
                <>
                  <p className="origin-school">{post.originSchoolName ? post.originSchoolName : '未設定原學校'}</p>
                  <span className='profile-details-arrow'>▶</span>
                  <p className="exchange-school">{post.exchangeSchoolName ? post.exchangeSchoolName : '?'}</p>
                </>
              )}
            </div>
          </div>
        </div>

        <div className='post-mini-text'>
          <p>
            於 {new Date(post.createdAt + 'Z').toLocaleDateString()} {new Date(post.createdAt + 'Z').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} 發表文章
          </p>
          <p className='dot'>·</p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleTranslate();
            }}
            disabled={isTranslating}>
            {isTranslating ? '翻譯中...' : (showOriginal ? '翻譯年糕' : '顯示原文')}
          </button>
        </div>

        {/* 顯示翻譯內容或原內容 */}
        <div className="post-content" style={{ whiteSpace: 'pre-wrap' }}>
          {showOriginal ? post.content : translatedContent}
        </div>

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
