import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';

const QsoForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    callsign: '',
    rst_received: '',
    rst_sent: '',
    op: '',
    qth: '',
    comments: ''
  });

  const [userEmail, setUserEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the logged-in user's email from localStorage or a context
    const email = localStorage.getItem('userEmail'); // Replace with actual email source
    setUserEmail(email || 'Guest');
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);

    // Clear form data
    setFormData({
      callsign: '',
      rst_received: '',
      rst_sent: '',
      op: '',
      qth: '',
      comments: ''
    });
  };

  const handleLogout = () => {
    // Clear the token and user info from localStorage
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userCallsign');

    // Redirect to login page
    navigate('/login');
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  return (
    <section className="qso-form">
      {/* Display logged-in user's email and Log out icon */}
      <div className="user-info">
        <div className="user-email-container">
          {userEmail && (
            <p className="user-email"><strong>Account:</strong> {userEmail}</p>
          )}
        </div>
        <div className="icon-container">
          {/* Home icon */}
          <div className="home-icon" onClick={handleHomeClick} title="Back to Home">
            <i className="fas fa-home"></i>
          </div>
          {/* Log out icon */}
          <div className="logout-icon" onClick={handleLogout} title="Log Out">
            <i className="fas fa-sign-out-alt"></i>
          </div>
        </div>
      </div>

      <h2>Create a New QSO</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="callsign">Callsign:</label>
        <input 
        type="text" 
        id="callsign" 
        name="callsign" 
        value={formData.callsign} 
        onChange={handleChange} 
        required />

        <label htmlFor="rst_received">RST Received:</label>
        <input 
        type="number" 
        id="rst_received" 
        name="rst_received" 
        value={formData.rst_received} 
        onChange={handleChange} 
        required />

        <label htmlFor="rst_sent">RST Sent:</label>
        <input 
        type="number" 
        id="rst_sent" 
        name="rst_sent" 
        value={formData.rst_sent} 
        onChange={handleChange} 
        required />

        <label htmlFor="op">Operator:</label>
        <input 
        type="text" 
        id="op" 
        name="op" 
        value={formData.op} 
        onChange={handleChange} 
        required />

        <label htmlFor="qth">Location (QTH):</label>
        <input 
        type="text" 
        id="qth" 
        name="qth" 
        value={formData.qth} 
        onChange={handleChange} 
        required />

        <label htmlFor="comments">Comments:</label>
        <textarea 
        id="comments" 
        name="comments" 
        rows="3" 
        value={formData.comments} 
        onChange={handleChange}>
          
        </textarea>
        <div className="form-actions">
          <button className="submit-qso">Submit</button>
        </div>
      </form>
    </section>
  );
};

export default QsoForm;
