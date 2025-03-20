const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

let token = '';

// 🔐 Route to fetch and store the token
app.post('/get-token', async (req, res) => {
  try {
    const response = await axios.post('http://20.244.56.144/test/auth', {
      companyName: "SRM University AP",
      clientID: "820ee10f-506d-4037-819d-cfb1c6cbcd8c",
      clientSecret: "snwXmjgcASxZBdcU",
      ownerName: "Kalluri Amarnadh Chowdary",
      ownerEmail: "amarnadhchowdary_kalluri@srmap.edu.in",
      rollNo: "AP22110010151"
    });
    token = response.data.access_token;
    console.log("✅ Token fetched:", token);
    res.send(response.data);
  } catch (err) {
    console.error("❌ Error fetching token:", err.response?.data || err.message);
    res.status(500).send(err.response?.data || err.message);
  }
});

// 📈 Route to fetch Top 5 users based on post count
app.get('/top-users', async (req, res) => {
  if (!token) return res.status(401).send({ error: "Token missing. Call /get-token first." });

  try {
    const userResponse = await axios.get('http://20.244.56.144/test/users', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const users = userResponse.data;

    // Sort by number of posts
    const sortedUsers = users.sort((a, b) => (b.posts?.length || 0) - (a.posts?.length || 0));
    res.send(sortedUsers.slice(0, 5));
  } catch (err) {
    console.error("❌ Error fetching users:", err.response?.data || err.message);
    res.status(500).send(err.response?.data || err.message);
  }
});

// 🌍 Route to fetch global posts (latest or popular)
app.get('/posts', async (req, res) => {
  const { type } = req.query;
  if (!token) return res.status(401).send({ error: "Token missing. Call /get-token first." });

  try {
    const postResponse = await axios.get('http://20.244.56.144/test/posts', {
      headers: { Authorization: `Bearer ${token}` }
    });
    let posts = postResponse.data;

    if (type === 'popular') {
      const maxComments = Math.max(...posts.map(post => post.comments?.length || 0));
      const popularPosts = posts.filter(post => (post.comments?.length || 0) === maxComments);
      res.send(popularPosts);
    } else if (type === 'latest') {
      posts.sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0));
      res.send(posts.slice(0, 5));
    } else {
      res.status(400).send({ error: "Invalid 'type'. Use 'latest' or 'popular'." });
    }
  } catch (err) {
    console.error("❌ Error fetching global posts:", err.response?.data || err.message);
    res.status(500).send(err.response?.data || err.message);
  }
});

// 🧑‍💻 Route to fetch posts by a specific user (Corrected user post endpoint)
app.get('/user/:userId/posts', async (req, res) => {
  const { userId } = req.params;
  if (!token) return res.status(401).send({ error: "Token missing. Call /get-token first." });

  try {
    const userPostResponse = await axios.get(`http://20.244.56.144/test/users/${userId}/posts`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    res.send(userPostResponse.data.posts);
  } catch (err) {
    console.error(`❌ Error fetching posts for user ${userId}:`, err.response?.data || err.message);
    res.status(500).send(err.response?.data || err.message);
  }
});

// 💬 Route to fetch comments of a specific post (Final API based on screenshot)
app.get('/post/:postId/comments', async (req, res) => {
  const { postId } = req.params;
  if (!token) return res.status(401).send({ error: "Token missing. Call /get-token first." });

  try {
    const commentResponse = await axios.get(`http://20.244.56.144/test/posts/${postId}/comments`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    res.send(commentResponse.data.comments);
  } catch (err) {
    console.error(`❌ Error fetching comments for post ${postId}:`, err.response?.data || err.message);
    res.status(500).send(err.response?.data || err.message);
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
