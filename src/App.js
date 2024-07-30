import React, { useState } from 'react';
import './App.css';
import QsoForm from './components/QsoForm';
import Header from './components/Header';
import Footer from './components/Footer';
import { Link } from 'react-router-dom';

function App() {
  const [qsoList, setQsoList] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (formData) => {
    try {
      const token = localStorage.getItem('jwtToken');

      const response = await fetch('http://localhost:3500/qso', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to create new QSO');
      }

      const newQso = await response.json();
      setQsoList([...qsoList, newQso]);

      setSuccessMessage('QSO successfully created!');

      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error creating new QSO:', error.message);
    }
  };

  return (
    <div className="App">
      <Header />
      <main>
        <QsoForm onSubmit={handleSubmit} />
        {successMessage && <p className="success-message">{successMessage}</p>}
        <p><Link to="/all-qsos">Click here to get all QSOs</Link></p>
      </main>
      <Footer />
    </div>
  );
}

export default App;
