import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSession } from '../SessionContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../homepage.css';
import { FaBars, FaTimes } from 'react-icons/fa';
import logo from '../assets/Chef book.png';

function Header() {
  const { user, setUser } = useSession();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    axios.post('http://localhost:3008/logout', {}, { withCredentials: true })
      .then(res => {
        if (res.data.success) {
          setUser(null);
          navigate('/login');
          window.location.replace('/login');
        }
      })
      .catch(err => console.log(err));
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <header className="header">
      <div className="hamburger" onClick={toggleMenu}>
        {isOpen ? <FaTimes /> : <FaBars />}
      </div>
      
      {/* App Name and Logo */}
      <div className="logo-section">
        <img src={logo} alt="Cook Book" className="logo" />
        <h1 className="app-name">Chef Book</h1>
      </div>
      
      <nav className={`nav-bar ${isOpen ? 'active' : ''}`}>
        <Link to="/home">Home</Link>
        <Link to="/RecipeDetails">Add Recipe</Link>
        <Link to="/ViewRecipe">View Recipe</Link>
        <Link to="/MyRecipes">My Recipes</Link>
      </nav>
      
      <div className="user-section">
        <h4 onClick={toggleDropdown} className="user-name">Welcome {user}</h4>
        {dropdownOpen && (
          <div className="dropdown">
            <Link to="/UpdatePassword" className="dropdown-item">Update Password</Link>
          </div>
        )}
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
    </header>
  );
}

export default Header;
