import React, { useState } from 'react';
import './App.css';
import QsoForm from './components/QsoForm';
import Header from './components/Header';
import Footer from './components/Footer';
import { Link } from 'react-router-dom';

function App() {
  const [qsoList, setQsoList] = useState([]);

  const handleSubmit = async (formData) => {
    try {
      const response = await fetch('http://localhost:3500/qso', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to create new QSO');
      }

      // Refresh QSO list after successful creation
      const newQso = await response.json();
      setQsoList([...qsoList, newQso]);
    } catch (error) {
      console.error('Error creating new QSO:', error.message);
    }
  };

  return (
    <div className="App">
      <Header />
      <main>
        <QsoForm onSubmit={handleSubmit} />
        <p><Link to="/all-qsos">Click here to get all QSOs</Link></p>
      </main>
      <Footer />
    </div>
  );
}

export default App;
