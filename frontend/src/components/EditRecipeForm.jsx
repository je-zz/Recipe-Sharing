import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useSession } from '../SessionContext';
import '../Style.css';
import Header from './Header';
import Footer from './Footer';
import { FaTimes } from 'react-icons/fa';

function EditRecipeForm({ selectedRecipe, handleBack, fetchMyRecipes }) {
  const { user } = useSession();
  const [editFormData, setEditFormData] = useState({ ...selectedRecipe });

  useEffect(() => {
    setEditFormData({ ...selectedRecipe });
  }, [selectedRecipe]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleVegTypeChange = (e) => {
    setEditFormData((prev) => ({ ...prev, vegType: e.target.value }));
  };

  const handleIngredientChange = (index, value) => {
    const newIngredients = [...editFormData.ingredients];
    newIngredients[index] = value;
    setEditFormData((prev) => ({ ...prev, ingredients: newIngredients }));
  };

  const handleStepChange = (index, value) => {
    const newSteps = [...editFormData.steps];
    newSteps[index] = value;
    setEditFormData((prev) => ({ ...prev, steps: newSteps }));
  };

  const addIngredientField = () => {
    setEditFormData((prev) => ({ ...prev, ingredients: [...prev.ingredients, ''] }));
  };

  const addStepField = () => {
    setEditFormData((prev) => ({ ...prev, steps: [...prev.steps, ''] }));
  };

  const removeIngredientField = (index) => {
    const newIngredients = editFormData.ingredients.filter((_, i) => i !== index);
    setEditFormData((prev) => ({ ...prev, ingredients: newIngredients }));
  };

  const removeStepField = (index) => {
    const newSteps = editFormData.steps.filter((_, i) => i !== index);
    setEditFormData((prev) => ({ ...prev, steps: newSteps }));
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:3008/update-recipe/${selectedRecipe._id}`, editFormData)
      .then(() => {
        alert('Recipe updated successfully');
        fetchMyRecipes();
        handleBack();
      })
      .catch((error) => console.error(error.message));
  };

  return (
    <div className='reci'>
      <Header />
      <div className="Recipe-background">
        <div className="Recipe-container">
          <h1 className="Recipe-title">Edit Recipe</h1>
          <form className="Recipe-form" onSubmit={handleUpdate}>
            <input type="text" name="name" placeholder="Enter Recipe Name" value={editFormData.name} onChange={handleInputChange} required />
            
            <input type="text" placeholder="Enter Description" name="description" value={editFormData.description} onChange={handleInputChange} />

            <div className="veg-options">
              <label>
                <input type="radio" value="Veg" checked={editFormData.vegType === 'Veg'} onChange={handleVegTypeChange} /> Veg
              </label>
              <label>
                <input type="radio" value="Non-Veg" checked={editFormData.vegType === 'Non-Veg'} onChange={handleVegTypeChange} /> Non-Veg
              </label>
            </div>

            <label>Ingredients:</label>
            {editFormData.ingredients.map((ingredient, index) => (
              <div key={index} className="input-with-remove">
                <input type="text" placeholder="Enter Ingredient" value={ingredient} onChange={(e) => handleIngredientChange(index, e.target.value)} />
                <FaTimes className="remove-icon" onClick={() => removeIngredientField(index)} />
              </div>
            ))}
            <button type="button" onClick={addIngredientField}>Add Ingredient</button>

            <label>Steps:</label>
            {editFormData.steps.map((step, index) => (
              <div key={index} className="input-with-remove">
                <input type="text" placeholder="Enter Step" value={step} onChange={(e) => handleStepChange(index, e.target.value)} />
                <FaTimes className="remove-icon" onClick={() => removeStepField(index)} />
              </div>
            ))}
            <button type="button" onClick={addStepField}>Add Step</button>
            
            <input type="number" name="cookingTime" placeholder="Enter Cooking Time" value={editFormData.cookingTime} onChange={handleInputChange} />
            <input type="number" name="servings" placeholder="Enter Servings" value={editFormData.servings} onChange={handleInputChange} />
            <input type="text" name="cuisineType" placeholder="Enter Cuisine Type" value={editFormData.cuisineType} onChange={handleInputChange} />
            
            <select name="difficulty" value={editFormData.difficulty} onChange={handleInputChange}>
              <option value="">Select Difficulty</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
            
            <button type="submit" className="btn btn-success">Update Recipe</button>
            <button onClick={handleBack} className="btn btn-secondary">Cancel</button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default EditRecipeForm;