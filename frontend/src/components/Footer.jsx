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
        <p>&copy; 2025 Cook Book. All Rights Reserved.</p>
      </div>
      <div className="footer-contact">
        <p>Contact Us: cookbook@example.com</p>
        <p>Phone: +1 234 567 890</p>
      </div>
    </footer>
  );
}

export default Footer;