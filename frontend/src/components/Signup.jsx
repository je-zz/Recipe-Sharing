import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import '../Style.css';

function Signup() {
  const [name, setName] = useState('') 
  const [email, setEmail] = useState('') 
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    axios.post('http://localhost:3008/register', { name, email, password })
      .then(result => {
        alert("Account created successfully") 
        navigate('/login')
      })
      .catch(err => console.log(err))
  }

  return (
    <div className="login-container">
    <div className="container">
      <div className="box">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter Name"
            autoComplete="off"
            name="name"
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Enter Email"
            autoComplete="off"
            name="email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Enter Password"
            name="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="btn-success">Register</button>
        </form>
        <Link to="/login" className="register-link">Already have an account? Login</Link>
      </div>
    </div>
    </div>
  );
};

export default Signup;
