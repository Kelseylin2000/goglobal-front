import React, { useState } from 'react';
import { editPost } from '../utils/api';  // 確保這個 API 存在
import { tagsList } from '../utils/constants';  // 確保有導入 tagsList 常量
import { toast } from 'react-toastify';

const EditPostModal = ({
  post,
  onClose,
  onPostUpdated,
  handleSavedPostUpdated,
  handleUploadInDetails
}) => {
  const token = localStorage.getItem('accessToken');

  // 設置初始內容
  const [content, setContent] = useState(post.content);
  const [selectedTags, setSelectedTags] = useState(Array.isArray(post.tags) ? [...post.tags] : []);
  const [images, setImages] = useState([]);  // 保存新上傳的圖片
  const [existingImages, setExistingImages] = useState(post.images ? [...post.images] : []); // 確保 post.images 存在


  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      if (selectedTags.length >= 3) {
        toast.error('最多只能選擇 3 個標籤');
        return;
      }
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const previewImages = (files) => {
    return Array.from(files).map((file) => URL.createObjectURL(file));
  };

  const handleSubmit = () => {
    if (!content.trim()) {
      toast.error('貼文內容不可為空');
      return;
    }

    const formData = new FormData();
    formData.append('content', content);
    selectedTags.forEach((tag) => formData.append('tags', tag));
    Array.from(images).forEach((image) => formData.append('imagesFiles', image));

    editPost(post.postId, formData, token)
      .then((data) => {
        toast.success('貼文已更新！');
        onPostUpdated(data.data);
        handleSavedPostUpdated(data.data)
        if(handleUploadInDetails != null){
            handleUploadInDetails();
        }
        onClose();
      })
      .catch((error) => {
        console.error('後端錯誤:', error.message);
      })
  };

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
        <h2>編輯貼文</h2>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="編輯你的想法..."
        />
        <label className="image-upload">
          <span>拖曳或點擊此處上傳圖片</span>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setImages(e.target.files)}
          />
          <div className="image-preview">
            {/* 顯示現有的圖片，若無圖片則不顯示 */}
            {existingImages.length > 0 ? existingImages.map((src, index) => (
              <img key={index} src={src} alt="現有圖片" />
            )) : <p>目前沒有圖片</p>}
            
            {/* 顯示新上傳圖片的預覽 */}
            {images.length > 0 ? previewImages(images).map((src, index) => (
              <img key={index} src={src} alt="新圖片預覽" />
            )) : <p>尚未上傳圖片</p>}
          </div>
        </label>
        <div className="tag-selection">
          {tagsList.map((tag) => (
            <button
              key={tag}
              className={selectedTags.includes(tag) ? 'selected' : ''}
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
        <div className="submit-button-container">
          <button className="btn-primary" onClick={handleSubmit}>
            保存更改
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPostModal;
