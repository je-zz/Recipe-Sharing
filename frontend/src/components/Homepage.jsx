import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import Header from './Header';
import { useSession } from '../SessionContext'
import ViewRecipe from './ViewRecipe'
import '../homepage.css'
import { Card, Button, Row, Col, Form } from 'react-bootstrap'

function Homepage() {
  const { user, setUser } = useSession()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [recipes, setRecipes] = useState([])
  const [selectedRecipe, setSelectedRecipe] = useState(null)

  const handleLogout = () => {
    axios.post('http://localhost:3008/logout', {}, { withCredentials: true })
      .then(res => {
        if (res.data.success) {
          setUser(null)
          navigate('/login')
          window.location.replace('/login')
        }
      })
      .catch(err => console.log(err))
  }

  const handleSearch = async () => {
    try {
      const res = await axios.get(`http://localhost:3008/search-recipes?query=${searchQuery}`)
      setRecipes(res.data)
    } catch (err) {
      console.error('Error fetching recipes:', err)
    }
  }

  const handleRecipeClick = (recipe) => {
    setSelectedRecipe(recipe)
  }

  const handleBack = () => {
    setSelectedRecipe(null)
  }

  useEffect(() => {
    if (searchQuery) {
      handleSearch()
    } else {
      setRecipes([])
    }
  }, [searchQuery])

  return (
    <div className="homepage-container">
      <Header />
      <h1 className="title">Recipe Management</h1>

      <div className="content">
        <Form.Control
          type="text"
          placeholder="Search Recipes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mb-4"
        />

        {selectedRecipe ? (
          <Card className="mb-4">
            <Card.Img variant="top" src={`http://localhost:3008/${selectedRecipe.image}`} />
            <Card.Body>
              <Card.Title>{selectedRecipe.name}</Card.Title>
              <Card.Text>{selectedRecipe.description}</Card.Text>
              <Button variant="primary" onClick={handleBack}>Back to Search Results</Button>
            </Card.Body>
          </Card>
        ) : searchQuery && recipes.length > 0 ? (
          <Row className="recipe-grid">
            {recipes.map(recipe => (
              <Col key={recipe._id} md={4} className="mb-4">
                <Card className="h-100 d-flex flex-column">
                  <Card.Img variant="top" src={`http://localhost:3008/${recipe.image}`} className="recipe-card-img" />
                  <Card.Body className="d-flex flex-column">
                    <Card.Title>{recipe.name}</Card.Title>
                    <Card.Text className="flex-grow-1">{recipe.description}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <ViewRecipe embedded={true} />
        )}
      </div>
    </div>
  )
}

export default Homepage
