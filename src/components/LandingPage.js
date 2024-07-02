import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to Ham Radio Log</h1>
      </header>
      <main className="register-main">
        <img className="radio-img" src={`${process.env.PUBLIC_URL}/radio-img.png`}></img>
        <div className="landing-page">
          <div className="landing-buttons">
          <p className="regist-text">You don't have an account? <strong>Register!</strong></p>
          <p className="login-text">Already have an account? <strong>Log In!</strong></p>
            <Link to="/register">
              <button className="regist-btn">Register</button>
            </Link>
            <Link to="/login">
              <button className="login-btn">Log In</button>
            </Link>
          </div>
        </div>
      </main>
      <footer>
        <p>&copy; {new Date().getFullYear()} Ham Radio Log. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
