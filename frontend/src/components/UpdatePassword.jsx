import React, { useState, useEffect } from 'react';
import '../Style.css'; 
import Header from './Header';

function UpdatePassword() {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        const response = await fetch('http://localhost:3008/get-user-email', {
          method: 'GET',
          credentials: 'include' 
        });

        const data = await response.json();

        if (response.ok) {
          setEmail(data.email);
        } else {
          console.error(data.error);
        }
      } catch (error) {
        console.error('Error fetching email:', error);
      }
    };

    fetchUserEmail();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3008/update-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, newPassword })
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Error updating password:', error);
      alert('Something went wrong. Please try again later.');
    }
  };

  return (
    <div className="update">
      <Header/>
    <div className="update-background">
      <div className="update-container">
        <h2 className="update-title">Update Password</h2>
        <form className="update-form" onSubmit={handleSubmit}>
          <div className="update-form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              disabled
            />
          </div>
          <div className="update-form-group">
            <label>New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <button className="update-button" type="submit">Update Password</button>
        </form>
      </div>
    </div>
    </div>
  );
}

export default UpdatePassword;
