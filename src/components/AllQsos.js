// src/components/AllQsos.js
import React, { useEffect, useState } from 'react';
import QsoList from './QsoList';
import Header from './Header';
import Footer from './Footer';

const AllQsos = () => {
  const [qsoList, setQsoList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQSOs();
  }, []);

  const fetchQSOs = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3500/qso');
      if (!response.ok) {
        throw new Error('Failed to fetch QSOs');
      }
      const data = await response.json();
      setQsoList(data);
    } catch (error) {
      console.error('Error fetching QSOs:', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <Header />
      <main>
        {loading ? <p>Loading...</p> : <QsoList qsoList={qsoList} />}
        <p><a href="/">Back to Home</a></p>
      </main>
      <Footer />
    </div>
  );
};

export default AllQsos;
