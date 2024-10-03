import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { searchPosts } from '../utils/api';
import PostList from '../components/PostList';
import LoadingSpinner from '../components/LoadingSpinner';

const SearchResultPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const keyword = queryParams.get('keyword');

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (keyword) {
        setLoading(true);
        try {
          const result = await searchPosts(keyword);
          setPosts(result.data);
        } catch (error) {
          console.error('Error fetching search results:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchSearchResults();
  }, [keyword]);

  return (
    <main>
      <h3> {keyword} 的搜尋結果</h3>
      {loading ? <LoadingSpinner /> : <PostList posts={posts} />}
    </main>
  );
};

export default SearchResultPage;