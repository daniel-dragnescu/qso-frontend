import React from 'react';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [formData, setFormData] = React.useState({
    email: '',
    password: ''
  });

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

      // Optionally handle success (e.g., redirect, store token)
    } catch (error) {
      console.error('Error logging in:', error.message);
      // Optionally handle error (e.g., display error message to user)
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to Ham Radio Log</h1>
      </header>
      <main className="login-main">
        <section className="login-form">
          <h2>Log in to your account</h2>
          <form onSubmit={handleSubmit} className="form-login">
            <div className="form-group-login">
              <label htmlFor="email">Email:</label>
              <input type="email" id="email" name="email" className="login-input" value={formData.email} onChange={handleChange} required />
            </div>
            
            <div className="form-group-login">
              <label htmlFor="password">Password:</label>
              <input type="password" id="password" name="password" className="login-input" value={formData.password} onChange={handleChange} required />
            </div>
            
            <div className="form-buttons login-buttons">
              <button type="submit" className="login-submit-btn">Log In</button>
              <button type="button" className="go-back-button login-back-btn" onClick={handleGoBack}>Go Back</button>
            </div>
          </form>
        </section>
      </main>
      <footer>
        <p>&copy; {new Date().getFullYear()} Ham Radio Log. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LoginForm;
