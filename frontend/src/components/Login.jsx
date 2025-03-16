import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { useSession } from '../SessionContext';
import '../Style.css';


function Login(){
  const [email, setEmail] = useState('') 
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const { fetchUser } = useSession()

  axios.defaults.withCredentials = true;

  const handleSubmit = (e) => {
    e.preventDefault()
    axios.post("http://localhost:3008/login", { email, password }, { withCredentials: true })
      .then(res => {
        if (res.data === "Success") {
          fetchUser() 
          navigate('/home')
        } else {
          alert("Wrong Email or Password") 
        }
      })
      .catch(err => {
        console.error(err)
        alert("Wrong Email or Password")
      })
  }

  return(
    <div className="login-container">
      <div className="container">
        <div className="login-box">
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
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
            <button type="submit" className="btn-success">Login</button>
          </form>
          <Link to="/register" className="register-link">New User? Register</Link>
        </div>
      </div>
      </div>
    );
    
};

export default Login;
