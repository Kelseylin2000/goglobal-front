import React from 'react';
import PostItem from './PostItem';

const PostList = ({
  posts,
  userId,
}) => {

  return (
    <div id="postList">
      {posts && (posts.map((post) => (
        <PostItem
          key={post.postId}
          post={post}
          userId={userId}
        />
      )))}
    </div>
  );
};

export default PostList;
