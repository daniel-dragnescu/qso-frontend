import React from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterForm = () => {
  const [formData, setFormData] = React.useState({
    email: '',
    callsign: '',
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

      // Optionally handle success (e.g., show success message to user, redirect)
    } catch (error) {
      console.error('Error registering:', error.message);
      // Optionally handle error (e.g., display error message to user)
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="App">
      <header className="App-header app-header-register">
        <h1>Welcome to Ham Radio Log</h1>
      </header>
      <main className="register-main">
        <section className="register-section">
          <h2>Register</h2>
          <form onSubmit={handleSubmit} className="form-register">
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input type="email" id="email" name="email" className="regist-input" value={formData.email} onChange={handleChange} required />
            </div>
            
            <div className="form-group">
              <label htmlFor="callsign">Callsign:</label>
              <input type="text" id="callsign" name="callsign" className="regist-input" value={formData.callsign} onChange={handleChange} required />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input type="password" id="password" name="password" className="regist-input" value={formData.password} onChange={handleChange} required />
            </div>
            <div className="form-buttons">
            <button type="submit" className="regist-submit-btn">Register</button>
            <button type="button" className="go-back-btn" onClick={handleGoBack}>Go Back</button>
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

export default RegisterForm;