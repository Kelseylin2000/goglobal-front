import React from 'react';
import PostItem from './PostItem';

const PostList = ({
  posts,
  userId,
}) => {
  if (!posts || posts.length === 0) {
    return <p>載入貼文中...</p>;
  }

  return (
    <div id="postList">
      {posts.map((post) => (
        <PostItem
          key={post.postId}
          post={post}
          userId={userId}
        />
      ))}
    </div>
  );
};

export default PostList;
