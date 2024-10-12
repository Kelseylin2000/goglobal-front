import React, { useState, useContext } from 'react';
import { createNewPost } from '../utils/api';
import { tagsList } from '../utils/constants';
import { toast } from 'react-toastify';
import { PostContext } from '../context/PostContext';
import { AuthContext } from '../context/AuthContext';

const PostForm = ({ onClose }) => {
  const { handlePostCreated } = useContext(PostContext);
  const { token } = useContext(AuthContext);

  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [images, setImages] = useState([]); // 保存File對象的陣列

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

  // 處理圖片選擇，保存到狀態中
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files); // 將 FileList 轉為陣列
    setImages(files); // 不疊加，直接保存新選擇的圖片
    e.target.value = '';
  };

  // 預覽圖片
  const previewImages = () => {
    return images.map((image) => URL.createObjectURL(image));
  };

  const MAX_IMAGE_SIZE = 1 * 1024 * 1024;
  const MAX_TOTAL_SIZE = 10 * 1024 * 1024;

  // 提交表單
  const handleSubmit = () => {
    if (!content.trim()) {
      toast.error('貼文內容不可為空');
      return;
    }

    const formData = new FormData();
    formData.append('content', content); // 貼文內容
    selectedTags.forEach((tag) => formData.append('tags', tag)); // 標籤

    let totalSize = 0;

  for (const image of images) {
    if (image.size > MAX_IMAGE_SIZE) {
      toast.error(`圖片大小不能超過 ${MAX_IMAGE_SIZE / 1024 / 1024}MB`);
      return;
    }

    totalSize += image.size;

    if (totalSize > MAX_TOTAL_SIZE) {
      toast.error(`總請求大小不能超過 ${MAX_TOTAL_SIZE / 1024 / 1024}MB`);
      return;
    }

    formData.append('imagesFiles', image);
  }


    createNewPost(formData, token)
      .then((response) => {
        toast.success('已成功創建貼文！');
        setContent(''); // 清空貼文內容
        setSelectedTags([]); // 清空標籤選擇
        setImages([]); // 清空已選圖片
        handlePostCreated(response.data); // 如果需要，通知父組件
      })
      .catch((error) => {
        console.error('後端錯誤:', error.message);
      })

      onClose();
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
      <h2>創建新貼文</h2>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="分享你的想法..."
      ></textarea>
      <label className="image-upload">
        <span>拖曳或點擊此處上傳圖片</span>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange} // 更新圖片選擇
        />
        <div className="image-preview">
          {previewImages().map((src, index) => (
            <img key={index} src={src} alt="預覽" />
          ))}
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
          發佈
        </button>
      </div>
      </div>
    </div>
  );
};

export default PostForm;
