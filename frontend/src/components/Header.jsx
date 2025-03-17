import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSession } from '../SessionContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../homepage.css';
import { FaBars, FaTimes } from 'react-icons/fa';

function Header() {
  const { user, setUser } = useSession();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

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

  return (
    <header className="header">
      <div className="hamburger" onClick={toggleMenu}>
        {isOpen ? <FaTimes /> : <FaBars />}
      </div>
      <nav className={`nav-bar ${isOpen ? 'active' : ''}`}>
        <Link to="/RecipeDetails">Recipe Details</Link>
        <Link to="/ViewRecipe">View Recipe</Link>
        <Link to="/MyRecipes">My Recipes</Link>
        <Link to="/UpdatePassword">Update Password</Link>
      </nav>
      <div className="user-section">
        <h4>Welcome {user}</h4>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
    </header>
  );
}

export default Header;
