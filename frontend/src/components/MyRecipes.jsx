// Client-Side: MyRecipes.jsx
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './MyRecipes.css';
import Header from './Header';
import Footer from './Footer';
import EditRecipeForm from './EditRecipeForm';

function MyRecipes() {
  const [data, setData] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchMyRecipes();
  }, []);

  const fetchMyRecipes = () => {
    axios.get('http://localhost:3008/getmyrecipes', { withCredentials: true })
      .then((response) => setData(response.data))
      .catch((error) => console.error(error.message));
  };

  const handleRecipeClick = (recipe) => {
    setSelectedRecipe(recipe);
  };

  const handleBack = () => {
    setSelectedRecipe(null);
    setIsEditing(false);
  };

  const handleDelete = (recipeId) => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      axios.delete(`http://localhost:3008/delete-recipe/${recipeId}`)
        .then(() => {
          alert('Recipe deleted successfully');
          fetchMyRecipes();
        })
        .catch((error) => console.error(error.message));
    }
  };

  const handleEdit = (recipe) => {
    setIsEditing(true);
    setSelectedRecipe(recipe);
  };
  useEffect(() => {
    setSelectedRecipe(null); // Reset the state
  }, [data]);
  

  return (
    <div className='Recipe'>
      <Header />
      <div className="my-container">
        <h1 className="my-title">My Recipes</h1>

        {isEditing ? (
          <EditRecipeForm 
            selectedRecipe={selectedRecipe} 
            handleBack={handleBack} 
            fetchMyRecipes={fetchMyRecipes} 
          />
        ) : selectedRecipe ? (
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
  {selectedRecipe.ingredients?.filter(ingredient => ingredient.trim() !== '').map((ingredient, index) => (
    <li key={index}>{ingredient}</li>
  ))}
</ul>

<h4>Steps:</h4>
<ul>
  {selectedRecipe.steps?.filter(step => step.trim() !== '').map((step, index) => (
    <li key={index}>{step}</li>
  ))}
</ul>

                  <p><strong>Cooking Time:</strong> {selectedRecipe.cookingTime} minutes</p>
                  <p><strong>Servings:</strong> {selectedRecipe.servings}</p>
                  <p><strong>Cuisine Type:</strong> {selectedRecipe.cuisineType}</p>
                  <p><strong>Difficulty:</strong> {selectedRecipe.difficulty}</p>

                  <button onClick={handleBack} className="btn btn-secondary">Back to My Recipes</button>
                  <button onClick={() => handleEdit(selectedRecipe)} className="btn btn-warning" style={{ marginLeft: '10px' }}>Edit</button>
                  <button onClick={() => handleDelete(selectedRecipe._id)} className="btn btn-danger" style={{ marginLeft: '10px' }}>Delete</button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="recipe-grid">
            {data.map((recipe) => (
              <div key={recipe._id} className="card" style={{ width: '100%' }}>
                <img src={`http://localhost:3008/${recipe.image}`} className="card-img-top" alt={recipe.name} style={{height:'280px'}}/>
                <div className="card-body">
                  <h5 className="card-title">{recipe.name}</h5>
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

export default MyRecipes;
