import Header from './Header';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import '../ViewRecipe.css';
import Footer from './Footer';
import { FaWhatsapp } from 'react-icons/fa';

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

  const shareOnWhatsApp = (recipe) => {
    const message = `Check out this amazing recipe: ${recipe.name} - ${recipe.description}.\nCooking Time: ${recipe.cookingTime} minutes.\nServings: ${recipe.servings}\nMore details at: http://localhost:5173/view/${recipe._id}`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className='view-container'>
      {!embedded && <Header />}

      
      <div className="view-container">
        <h1 className="view-title">Recipe Details</h1>
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

                  {selectedRecipe.ingredients?.length > 0 && (
                    <>
                      <h4>Ingredients:</h4>
                      <ul>
                        {selectedRecipe.ingredients.map((ingredient, index) => (
                          <li key={index}>{ingredient}</li>
                        ))}
                      </ul>
                    </>
                  )}

                  {selectedRecipe.steps?.length > 0 && (
                    <>
                      <h4>Steps:</h4>
                      <ul>
                        {selectedRecipe.steps.map((step, index) => (
                          <li key={index}>{step}</li>
                        ))}
                      </ul>
                    </>
                  )}

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
        ) : (
          <div className="recipe-grid">
            {data.map((recipe, index) => (
              <div key={index} className="card" style={{ width: '18rem' }}>
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
        )}
      </div>
      <Footer />
    </div>
  );
}

export default ViewRecipe;
