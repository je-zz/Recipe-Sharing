import Header from './Header';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import '../ViewRecipe.css';
import { Card, Button, Row, Col } from 'react-bootstrap';

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
          <Card className="mb-4">
            <Card.Img variant="top" src={`http://localhost:3008/${selectedRecipe.image}`} />
            <Card.Body>
              <Card.Title>{selectedRecipe.name}</Card.Title>
              <Card.Text><strong>Description:</strong> {selectedRecipe.description}</Card.Text>
              <Card.Text><strong>Ingredients:</strong> {selectedRecipe.ingredients.join(", ")}</Card.Text>
              <Card.Text><strong>Steps:</strong> {selectedRecipe.steps.join(", ")}</Card.Text>
              <Card.Text><strong>Cooking Time:</strong> {selectedRecipe.cookingTime} minutes</Card.Text>
              <Card.Text><strong>Servings:</strong> {selectedRecipe.servings}</Card.Text>
              <Card.Text><strong>Cuisine Type:</strong> {selectedRecipe.cuisineType}</Card.Text>
              <Card.Text><strong>Difficulty:</strong> {selectedRecipe.difficulty}</Card.Text>
              <Button variant="primary" onClick={handleBack}>Back to All Recipes</Button>
            </Card.Body>
          </Card>
        ) : (
          <Row>
            {data.map((recipe, index) => (
              <Col key={index} md={4} className="mb-4">
                <Card onClick={() => handleRecipeClick(recipe)}>
                  <Card.Img variant="top" src={`http://localhost:3008/${recipe.image}`} />
                  <Card.Body>
                    <Card.Title>{recipe.name}</Card.Title>
                    <Card.Text>{recipe.description}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
}

export default ViewRecipe;