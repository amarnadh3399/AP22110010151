import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Feed = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/posts?type=latest')
      .then(response => setPosts(response.data))
      .catch(error => console.error('Error fetching feed:', error));
  }, []);

  return (
    <div>
      <h2>Latest Feed</h2>
      <ul>
        {posts.map(post => (
          <li key={post.id}>{post.title} - {new Date(post.timestamp).toLocaleString()}</li>
        ))}
      </ul>
    </div>
  );
};

export default Feed;
