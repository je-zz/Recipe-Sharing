import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'

import Signup from './components/Signup'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './components/Login'
import RecipeDetails from './components/RecipeDetails'
import ViewRecipe from './components/ViewRecipe'
import Homepage from './components/Homepage'
import MyRecipes from './components/MyRecipes'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import UpdatePassword from './components/UpdatePassword'

// Prevent back button after logout
function PreventBackAfterLogout() {
  const location = useLocation()

  useEffect(() => {
    if (location.pathname === '/login' || location.pathname === '/') {
      window.history.pushState(null, null, location.pathname)
    }

    const handleBack = () => {
      if (location.pathname === '/login' || location.pathname === '/') {
        window.history.pushState(null, null, location.pathname)
      }
    }

    window.addEventListener('popstate', handleBack)

    return () => {
      window.removeEventListener('popstate', handleBack)
    }
  }, [location])

  return null
}

function App() {
  return (
    <BrowserRouter>
      <PreventBackAfterLogout /> {/* 👈 Add it here */}
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/register' element={<Signup />} />
        <Route path='/login' element={<Login />} />
        <Route path='/home' element={<Homepage />} />
        <Route path='/RecipeDetails' element={<RecipeDetails />} />
        <Route path='/ViewRecipe' element={<ViewRecipe />} />
        <Route path='/MyRecipes' element={<MyRecipes />} />
        <Route path='/UpdatePassword' element={<UpdatePassword />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
