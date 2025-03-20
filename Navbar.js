import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/" className="nav-link">Top Users</Link>
      <Link to="/trending" className="nav-link">Trending Posts</Link>
      <Link to="/feed" className="nav-link">Feed</Link>
    </nav>
  );
};

export default Navbar;
