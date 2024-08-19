import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const UpdateUserForm = ({ initialEmail = '', initialPassword = '' }) => {
  const [user, setUser] = useState({ email: initialEmail, password: initialPassword });
  const [error, setError] = useState('');
  const [validationMessage, setValidationMessage] = useState(''); // Single state for validation message
  const navigate = useNavigate();

  const validateInputs = () => {
    let message = '';

    if (user.email.length > 0 && user.email.length < 7) {
      message = 'Your email is too short. You need minimum 7 characters.';
    } else if (user.password.length > 0 && user.password.length < 5) {
      message = 'Your password is too short. You need minimum 5 characters.';
    }

    setValidationMessage(message);

    if (message) {
      // Clear the validation message after 3 seconds
      setTimeout(() => {
        setValidationMessage('');
      }, 3000);
    }

    // Return true if there are no validation errors
    return !message;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const isValid = validateInputs(); // Validate inputs before proceeding

    if (!isValid) {
      return; // If validation fails, do not proceed with saving
    }

    const token = localStorage.getItem('jwtToken'); // Get JWT from localStorage
    const userId = localStorage.getItem('userId'); // Assuming you store user ID in localStorage

    if (!userId) {
      setError('User ID not found');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3500/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(user)
      });

      if (!response.ok) throw new Error('Failed to update user data');
      localStorage.setItem('userEmail', user.email);


      navigate(-1); // Redirect to the previous page after successful update
    } catch (err) {
      setError('Failed to update user data.');
      console.error(err);
    }
  };

  const handleCancel = () => {
    navigate(-1); // Redirect to the previous page without saving
  };

  return (
    <div className="App">
      <Header />
      <main className="register-main">
        <section className="register-section">
            <h2>Update Your Account</h2>
          {error && <p className="error-message">{error}</p>}
          <form onSubmit={handleSave} className="form-register">
            <div className="form-group">
              <label htmlFor="account-email">New Email: </label>
              <input
              required
                type="email"
                id="account-email"
                name="email"
                value={user.email}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="account-password">New Password: </label>
              <input
                required
                type="password"
                id="account-password"
                name="password"
                value={user.password}
                onChange={handleChange}
              />
            </div>
            <div className="form-buttons">
            <button type="submit" className="save-user">
              Save
            </button>
            <button type="button" className="cancel-user" onClick={handleCancel}>
              Cancel
            </button>
            </div>
            {validationMessage && <p className="validation-message">{validationMessage}</p>} {/* Display single validation message */}
          </form>
        </section>
    </main>
    <Footer />
    </div>
  );
};

export default UpdateUserForm;