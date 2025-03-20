import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TrendingPosts = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/posts?type=popular')
      .then(response => setPosts(response.data))
      .catch(error => console.error('Error fetching trending posts:', error));
  }, []);

  return (
    <div>
      <h2>Trending Posts</h2>
      <ul>
        {posts.map(post => (
          <li key={post.id}>{post.title} - Comments: {post.comments.length}</li>
        ))}
      </ul>
    </div>
  );
};

export default TrendingPosts;
