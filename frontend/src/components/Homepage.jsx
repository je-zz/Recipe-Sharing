import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';
import { useSession } from '../SessionContext';
import ImageCarousel from './ImageCarousel';
import '../homepage.css';
import { FaFilter, FaWhatsapp } from 'react-icons/fa';

function Homepage() {
  const { user, setUser } = useSession();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [showFilter, setShowFilter] = useState(false);

  const handleLogout = async () => {
    try {
      const res = await axios.post('http://localhost:3008/logout', {}, { withCredentials: true });
      if (res.data.success) {
        setUser(null);
        navigate('/login');
        window.location.replace('/login');
      }
    } catch (err) {
      console.error('Logout Error:', err);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery) {
      setRecipes([]);
      return;
    }

    try {
      const { data } = await axios.get(`http://localhost:3008/search-recipes?query=${searchQuery}`);
      setRecipes(data);
    } catch (err) {
      console.error('Error fetching recipes:', err);
    }
  };

  const handleRecipeClick = (recipe) => setSelectedRecipe(recipe);

  const handleBack = () => setSelectedRecipe(null);

  const handleFilterChange = (difficulty) => {
    setDifficultyFilter(difficulty);
    setShowFilter(false);
  };

  const shareOnWhatsApp = (recipe) => {
    if (!recipe || !recipe._id) return;
    const message = `Check out this amazing recipe: ${recipe.name} - ${recipe.description}.
Cooking Time: ${recipe.cookingTime} minutes.
Servings: ${recipe.servings}
More details at: http://localhost:5173/view/${recipe._id}`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
  };

  const filteredRecipes = recipes.filter((recipe) => {
    if (!difficultyFilter) return true;
    return recipe.difficulty.toLowerCase() === difficultyFilter.toLowerCase();
  });

  useEffect(() => {
    handleSearch();
  }, [searchQuery]);

  return (
    <div className="homepage-container">
      <Header />

      <div className="content">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search Recipes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="filter-section">
            <FaFilter className="filter-icon" onClick={() => setShowFilter(!showFilter)} />
            {showFilter && (
              <div className="filter-options">
                {['All', 'Easy', 'Medium', 'Hard'].map((level) => (
                  <div
                    key={level}
                    className={`filter-option ${difficultyFilter === level || (level === 'All' && !difficultyFilter) ? 'active' : ''}`}
                    onClick={() => handleFilterChange(level === 'All' ? '' : level)}
                  >
                    {level}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {selectedRecipe ? (
          <div className="card mb-3" style={{ maxWidth: '100%' }}>
            <div className="row g-0">
              <div className="col-md-4">
                <img src={`http://localhost:3008/${selectedRecipe.image}`} className="img-fluid rounded-start" alt={selectedRecipe.name} />
              </div>
              <div className="col-md-8">
                <div className="card-body">
                  <h5 className="card-title">{selectedRecipe.name}</h5>
                  <p><strong>Veg Type:</strong> {selectedRecipe.vegType}</p>
                  <p>{selectedRecipe.description}</p>

                  <h4>Ingredients:</h4>
                  <ul>
                    {selectedRecipe.ingredients.map((ingredient, index) => (
                      <li key={index}>{ingredient}</li>
                    ))}
                  </ul>

                  <h4>Steps:</h4>
                  <ul>
                    {selectedRecipe.steps.map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ul>

                  <p><strong>Cooking Time:</strong> {selectedRecipe.cookingTime} minutes</p>
                  <p><strong>Servings:</strong> {selectedRecipe.servings}</p>
                  <p><strong>Cuisine Type:</strong> {selectedRecipe.cuisineType}</p>
                  <p><strong>Difficulty:</strong> {selectedRecipe.difficulty}</p>

                  <button onClick={handleBack} className="btn btn-secondary">Back to All Recipes</button>
                  <button onClick={() => shareOnWhatsApp(selectedRecipe)} className="btn btn-success ms-2">
                    <FaWhatsapp /> Share on WhatsApp
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : searchQuery && filteredRecipes.length > 0 ? (
          <div className="recipe-grid">
            {filteredRecipes.map((recipe) => (
              <div key={recipe._id} className="card" style={{ width: '18rem' }}>
                <img src={`http://localhost:3008/${recipe.image}`} className="card-img-top" alt={recipe.name} style={{height:'280px'}}/>
                <div className="card-body">
                  <h5 className="card-title">{recipe.name}</h5>
                  <p style={{ color: recipe.vegType === 'Veg' ? 'green' : 'red', fontWeight: 'bold' }}>{recipe.vegType}</p>
                  <p><strong>Difficulty:</strong> {recipe.difficulty}</p>
                  <button onClick={() => handleRecipeClick(recipe)} className="btn btn-primary">View Details</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-recipes">
            <p>Start searching for recipes to see results.</p>
          </div>
        )}
      </div>

      <ImageCarousel className="image-carousel" />
      <Footer />
    </div>
  );
}

export default Homepage;
