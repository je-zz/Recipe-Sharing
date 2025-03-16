import Header from './Header';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import '../ViewRecipe.css';

function ViewRecipe({ embedded }) {
  const [data, setData] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:3008/getrecipedetails')
      .then((response) => setData(response.data))
      .catch((error) => console.error(error.message));
  }, []);

  const handleRecipeClick = (recipe) => {
    setSelectedRecipe(recipe);
  };

  const handleBack = () => {
    setSelectedRecipe(null);
  };

  return (
    <div className='view'>
      {/* Only render the header if not embedded */}
      {!embedded && <Header />}

      <h1 className="title">Recipe Details</h1>
      <div className="container">
        {selectedRecipe ? (
          <div className="recipe-details-page">
            <div className="background-image" style={{ backgroundImage: `url(http://localhost:3008/${selectedRecipe.image})` }}></div>
            <div className="details-container">
              <h2>{selectedRecipe.name}</h2>
              <p><strong>Description:</strong> {selectedRecipe.description}</p>
              <h4>Ingredients:</h4>
              <p>{selectedRecipe.ingredients.join(", ")}</p>
              <h4>Steps:</h4>
              <p>{selectedRecipe.steps.join(", ")}</p>
              <p><strong>Cooking Time:</strong> {selectedRecipe.cookingTime} minutes</p>
              <p><strong>Servings:</strong> {selectedRecipe.servings}</p>
              <p><strong>Cuisine Type:</strong> {selectedRecipe.cuisineType}</p>
              <p><strong>Difficulty:</strong> {selectedRecipe.difficulty}</p>
              <button onClick={handleBack}>Back to All Recipes</button>
            </div>
          </div>
        ) : (
          <div className="recipe-grid">
            {data.map((recipe, index) => (
              <div key={index} className="recipe-card" onClick={() => handleRecipeClick(recipe)}>
                <h2>{recipe.name}</h2>
                {recipe.image && (
                  <img src={`http://localhost:3008/${recipe.image}`} alt={recipe.name} className="recipe-image" />
                )}
                <p>{recipe.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewRecipe;
