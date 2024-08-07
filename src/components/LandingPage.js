import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      navigate('/create-new-qso');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="App">
      <Header />
      <main className="landing-main">
        <img className="radio-img" src={`${process.env.PUBLIC_URL}/radio-img.png`} alt="Radio Image"></img>
        <div className="landing-page">
          <div className="landing-buttons">
          <p className="regist-text">You do not have an account? <strong>Register!</strong></p>
          <p className="login-text">Already have an account? <strong>Log In!</strong></p>
            <Link to="/register">
              <button className="regist-btn">Register</button>
            </Link>
            <Link to="/login">
              <button className="login-btn" onClick={handleLoginClick}>Log In</button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
