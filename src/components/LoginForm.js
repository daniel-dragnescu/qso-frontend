// Login.js
import React from 'react';

const LoginForm = () => {
  const [formData, setFormData] = React.useState({
    email: '',
    password: ''
  });

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

  return (
    <section className="login-form">
      <h2>Login to your account</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
        
        <label htmlFor="password">Password:</label>
        <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
        
        <button type="submit" className="login-submit-btn">Log In</button>
      </form>
    </section>
  );
};

export default LoginForm;
