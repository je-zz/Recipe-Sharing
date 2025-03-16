import axios from 'axios';
import React, { useState } from 'react';
import { useSession } from '../SessionContext';
import '../Style.css';
import Header from './Header';

function RecipeDetails() {
  const { user } = useSession();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState(['']);
  const [steps, setSteps] = useState(['']);
  const [cookingTime, setCookingTime] = useState('');
  const [servings, setServings] = useState('');
  const [cuisineType, setCuisineType] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [file, setFile] = useState(null);

  const handleIngredientChange = (index, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };

  const handleStepChange = (index, value) => {
    const newSteps = [...steps];
    newSteps[index] = value;
    setSteps(newSteps);
  };

  const addIngredientField = () => {
    setIngredients([...ingredients, '']);
  };

  const addStepField = () => {
    setSteps([...steps, '']);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const sendData = async (e) => {
    e.preventDefault();

    const filteredIngredients = ingredients.filter(ingredient => ingredient.trim() !== '');
    const filteredSteps = steps.filter(step => step.trim() !== '');

    if (filteredIngredients.length === 0 || filteredSteps.length === 0) {
      alert('Please add at least one ingredient and one step');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name);
    formData.append('description', description);
    formData.append('ingredients', filteredIngredients.join(", "));
    formData.append('steps', filteredSteps.join(", "));
    formData.append('cookingTime', cookingTime);
    formData.append('servings', servings);
    formData.append('cuisineType', cuisineType);
    formData.append('difficulty', difficulty);

    try {
      const response = await axios.post('http://localhost:3008/postrecipedetails', formData, { withCredentials: true });
      console.log(response.data);

      setName('');
      setDescription('');
      setIngredients(['']);
      setSteps(['']);
      setCookingTime('');
      setServings('');
      setCuisineType('');
      setDifficulty('');
      setFile(null);

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='reci'>
      <Header/>
    <div className="Recipe-background">
      <div className="Recipe-container">
        <h1 className="Recipe-title">Recipe Details</h1>
        <form className="Recipe-form" onSubmit={sendData} encType="multipart/form-data">
          <input type="text" placeholder="Enter Recipe Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <input type="text" placeholder="Enter Description" value={description} onChange={(e) => setDescription(e.target.value)} />

          {ingredients.map((ingredient, index) => (
            <input
              key={index}
              type="text"
              placeholder="Enter Ingredient"
              value={ingredient}
              onChange={(e) => handleIngredientChange(index, e.target.value)}
            />
          ))}
          <button type="button" onClick={addIngredientField}>Add Ingredient</button>

          {steps.map((step, index) => (
            <input
              key={index}
              type="text"
              placeholder="Enter Step"
              value={step}
              onChange={(e) => handleStepChange(index, e.target.value)}
            />
          ))}
          <button type="button" onClick={addStepField}>Add Step</button>

          <input type="number" placeholder="Enter Cooking Time" value={cookingTime} onChange={(e) => setCookingTime(e.target.value)} />
          <input type="number" placeholder="Enter Servings" value={servings} onChange={(e) => setServings(e.target.value)} />
          <input type="text" placeholder="Enter Cuisine Type" value={cuisineType} onChange={(e) => setCuisineType(e.target.value)} />
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
            <option value="">Select Difficulty</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

          <input type="file" onChange={handleFileChange} />

          <input type="submit" value="Submit" />
        </form>
      </div>
    </div>
    </div>
  );
}

export default RecipeDetails;