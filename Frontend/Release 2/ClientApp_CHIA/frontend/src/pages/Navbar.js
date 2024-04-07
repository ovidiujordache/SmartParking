import React from 'react';
import '../assets/css/navbar.css';

const Navbar = () => {
    return (
        <nav className="navbarT">
    <ul className="navbarT-nav">
      <li className="navT-item">
        <a href="/">Home</a>
      </li>
      <li className="navT-item">
        <a href="/map">Map</a>
      </li>
      <li className="navT-item">
        <a href="/live">Live</a>
      </li>
      <li className="navT-item">
        <a href="/table">Table</a>
      </li>
    </ul>
  </nav>
  );
};

export default Navbar;