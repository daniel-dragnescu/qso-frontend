import React from 'react';

const RegisterForm = () => {
  const [formData, setFormData] = React.useState({
    email: '',
    callsign: '',
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

  return (
    <section className="register-form">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
        
        <label htmlFor="callsign">Callsign:</label>
        <input type="text" id="callsign" name="callsign" value={formData.callsign} onChange={handleChange} required />
        
        <label htmlFor="password">Password:</label>
        <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
        
        <button type="submit" className="regist-submit-btn">Register</button>
      </form>
    </section>
  );
};

export default RegisterForm;
