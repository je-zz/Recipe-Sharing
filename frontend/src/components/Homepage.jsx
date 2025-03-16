import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import Header from './Header';
import { useSession } from '../SessionContext'
import ViewRecipe from './ViewRecipe'
import '../homepage.css'


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

      
      <div className="content">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search Recipes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {selectedRecipe ? (
  <div className="recipe-details">
    <h2>{selectedRecipe.name}</h2>
    <img src={`http://localhost:3008/${selectedRecipe.image}`} alt={selectedRecipe.name} className="recipe-image" />
    <p>{selectedRecipe.description}</p>
    <button onClick={handleBack}>Back to Search Results</button>
  </div>
) : searchQuery && recipes.length > 0 ? (
  <div className="search-results">
    <h4>Search Results:</h4>
    <div className="recipe-grid">
      {recipes.map(recipe => (
        <div key={recipe._id} className="recipe-card" onClick={() => handleRecipeClick(recipe)}>
          <h2>{recipe.name}</h2>
          {recipe.image && (
            <img src={`http://localhost:3008/${recipe.image}`} alt={recipe.name} className="recipe-image" />
          )}
          <p>{recipe.description}</p>
        </div>
      ))}
    </div>
  </div>
) : (
  <ViewRecipe embedded={true} />
)}
      </div>
    </div>
  )
}

export default Homepage
