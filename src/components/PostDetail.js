import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addComment, deleteComment } from '../utils/api';
import PostItem from './PostItem';
import { toast } from 'react-toastify';

const PostDetail = ({
  post,
  userId,
  navigateBack,
  loadPostDetail
}) => {
    const token = localStorage.getItem('accessToken');
    const [commentContent, setCommentContent] = useState('');
    const [comments, setComments] = useState(post.comments || []);
    const navigate = useNavigate();

    useEffect(() => {
        setComments(post.comments || []);
      }, [post.comments]);

    const handleAddComment = () => {
      if (!commentContent.trim()) {
        toast.error('留言內容不可為空');
        return;
      }
  
      addComment(post.postId, commentContent, token)
        .then((data) => {
            setCommentContent('');
            post.comments.push({
            commentId: data.data.commentId,
            userId,
            name: data.data.name,
            content: commentContent,
            timestamp: data.data.timestamp
            });
            toast.success("已留言");
        })
        .catch((error) => {
            console.error('後端錯誤:', error.message);
        })
    };
  
    const handleDeleteComment = (commentId) => {
      if (!window.confirm('確定要刪除這條評論嗎？')) return;
  
      deleteComment(post.postId, commentId, token)
        .then(() => {
          loadPostDetail();
          toast.success("留言已刪除");
        })
        .catch((error) => {
          console.error('後端錯誤:', error.message);
          toast.error('留言刪除失敗，請稍後再試。');
        });
    };

    const handleUploadInDetails = () => {
        loadPostDetail();
    };

    const formatTimeAgo = (timestamp) => {
        const now = new Date();
        const diffInMs = now - new Date(timestamp  + 'Z');
        const diffInSeconds = Math.floor(diffInMs / 1000);
      
        if (diffInSeconds <= 0){
          return '0秒前';
        }else if (diffInSeconds < 60) {
          return `${diffInSeconds}秒前`;
        } else if (diffInSeconds < 3600) {
          const minutes = Math.floor(diffInSeconds / 60);
          return `${minutes}分鐘前`;
        } else if (diffInSeconds < 86400) {
          const hours = Math.floor(diffInSeconds / 3600);
          return `${hours}小時前`;
        } else if (diffInSeconds < 604800) {
          const days = Math.floor(diffInSeconds / 86400);
          return `${days}天前`;
        } else {
          return new Date(timestamp  + 'Z').toLocaleDateString(); // 超過一周顯示日期
        }
      };

  return (
    <>
      {/* 使用 PostItem 來顯示貼文 */}
      <PostItem
        post={post}
        userId={userId}
        handleUploadInDetails={handleUploadInDetails}
      />

      {/* 評論區域 */}
      <div className="comments-section">
        <div id="comments">
          {post.comments && post.comments.length > 0 ? (
            post.comments.map((comment) => (
              <div className="comment" key={comment.commentId}>
                <img
                  src={`https://i.pravatar.cc/200?u=${comment.userId}`}
                  alt="Avatar"
                  className="avatar"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/user/${comment.userId}`);
                  }}
                />
                <div className="comment-content">
                <p className="comment-author">
                    {comment.name}
                    <span className="comment-timestamp">{formatTimeAgo(comment.timestamp)}</span>
                </p>                  
                <p>{comment.content}</p>
                  {comment.userId == userId && (
                    <div className="comment-actions">
                      <button onClick={() => handleDeleteComment(comment.commentId)}>
                        <img src="/img/delete.png" alt="刪除" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p>目前還沒有人留言，快來成為第一個留言的人吧！</p>
          )}
        </div>
        <div className="comment-form">
          <input
            type="text"
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            placeholder="寫下你的想法..."
          ></input>
          <div className="submit-button-container">
            <button className="btn-primary" onClick={handleAddComment}>
              留言
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PostDetail;
