import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    callsign: '',
    password: ''
  });

  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3500/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      const data = await response.json();
      console.log('Registration successful:', data);

      // Clear form data
      setFormData({
        email: '',
        callsign: '',
        password: ''
      });

      // Show success message
      setSuccessMessage('You have successfully registered!');
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000); // Message disappears after 3 seconds

    } catch (error) {
      console.error('Error registering:', error.message);
      // Optionally handle error (e.g., display error message to user)
    }
  };

  const handleGoBack = () => {
    navigate('/');
  };

  return (
    <div className="App">
      <Header />
      <main className="register-main">
        <section className="register-section">
          <h2>Register</h2>
          <form onSubmit={handleSubmit} className="form-register">
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                className="regist-input"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="callsign">Callsign:</label>
              <input
                type="text"
                id="callsign"
                name="callsign"
                className="regist-input"
                value={formData.callsign}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                name="password"
                className="regist-input"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-buttons">
              <button type="submit" className="regist-submit-btn">Register</button>
              <button type="button" className="go-back-btn" onClick={handleGoBack}>Go Back</button>
            </div>
            {successMessage && <p className="success-message">{successMessage}</p>}
          </form>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default RegisterForm;
