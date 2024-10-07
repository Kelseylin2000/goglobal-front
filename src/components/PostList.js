import React from 'react';
import PostItem from './PostItem';

const PostList = ({
  posts,
  userId,
}) => {

  console.log(posts);

  return (
    <div id="postList">
      {posts && posts.length > 0 && (posts.map((post) => (
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
