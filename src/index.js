import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App';
import AllQsos from './components/AllQsos';
import LandingPage from './components/LandingPage';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';
import ProtectedRoute from './components/ProtectedRoute';
import UpdateUserForm from './components/UpdateUserForm';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
  <Router>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/create-new-qso" element={<ProtectedRoute element={App} />} />
      <Route path="/all-qsos" element={<ProtectedRoute element={AllQsos} />} />
      <Route path="/update-user" element={<ProtectedRoute element={UpdateUserForm} />} />
    </Routes>
  </Router>
</React.StrictMode>
);
