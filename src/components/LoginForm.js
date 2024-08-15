import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const LoginForm = () => {
  const [formData, setFormData] = React.useState({
    callsign: '',
    password: ''
  });

  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      navigate('/create-new-qso');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3500/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      console.log('Login successful:', data);

      // Store user email in local storage
      localStorage.setItem('jwtToken', data.accessToken);
      localStorage.setItem('userEmail', data.user.email);
      localStorage.setItem('userCallsign', data.user.callsign);
      localStorage.setItem('userId', data.user.id); // Store user ID

      // Redirect to /create-new-qso
      navigate('/create-new-qso');
    } catch (error) {
      console.error('Error logging in:', error.message);
      setErrorMessage('Something went wrong. Please, try again!');
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
      // Optionally handle error (e.g., display error message to user)
    }
  };

  const handleGoBack = () => {
    navigate('/');
  };

  return (
    <div className="App">
      <Header />
      <main className="login-main">
        <section className="login-form">
          <h2>Log in to your account</h2>
          <form onSubmit={handleSubmit} className="form-login">
            <div className="form-group-login">
              <label htmlFor="callsign">Callsign:</label>
              <input 
              type="text" 
              id="callsign" 
              name="callsign" 
              className="login-input" 
              value={formData.callsign} 
              onChange={handleChange} 
              required />
            </div>
            
            <div className="form-group-login">
              <label htmlFor="password">Password:</label>
              <input 
              type="password" 
              id="password" 
              name="password" 
              className="login-input" 
              value={formData.password} 
              onChange={handleChange} 
              required />
            </div>
            
            <div className="form-buttons login-buttons">
              <button type="submit" className="login-submit-btn">Log In</button>
              <button type="button" className="go-back-button login-back-btn" onClick={handleGoBack}>Go Back</button>
            </div>
            {errorMessage && <p className="validation-message">{errorMessage}</p>}
          </form>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default LoginForm;
