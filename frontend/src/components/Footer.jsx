import React from 'react';
import { Link } from 'react-router-dom';
import '../homepage.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-links">
        <Link to="/home">Home</Link>
        <Link to="/RecipeDetails">Add Recipe</Link>
        <Link to="/ViewRecipe">View Recipe</Link>
        <Link to="/MyRecipes">My Recipes</Link>
        <Link to="/UpdatePassword">Update Password</Link>
      </div>
      <div className="footer-copyright">
        <p>&copy; 2025 Chef Book. All Rights Reserved.</p>
      </div>
      <div className="footer-contact">
        <p>Contact Us: chefbook@outlook.com</p>
        <p>Phone: +91 8888 21 5004</p>
      </div>
    </footer>
  );
}

export default Footer;