import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './MyRecipes.css';
import Header from './Header';

function MyRecipes() {
  const [data, setData] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:3008/getmyrecipes', { withCredentials: true })
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
    <div className='Recipe'>
      <Header/>
      <div className="my-container">
        <h1 className="my-title">My Recipes</h1>

        {selectedRecipe ? (
          <div className="my-recipe-details-page">
            <div 
              className="my-background-image" 
              style={{ backgroundImage: `url(http://localhost:3008/${selectedRecipe.image})` }}
            ></div>
            <div className="my-details-container">
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
              <button onClick={handleBack}>Back to My Recipes</button>
            </div>
          </div>
        ) : (
          <div className="my-recipe-grid">
            {data.map((recipe, index) => (
              <div key={index} className="my-recipe-card" onClick={() => handleRecipeClick(recipe)}>
                <h2>{recipe.name}</h2>
                {recipe.image && (
                  <img
                    src={`http://localhost:3008/${recipe.image}`}
                    alt={recipe.name}
                    className="my-recipe-image"
                  />
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

export default MyRecipes;