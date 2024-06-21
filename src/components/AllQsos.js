import React, { useEffect, useState, useRef } from 'react';
import QsoList from './QsoList';
import Header from './Header';
import Footer from './Footer';

const AllQsos = () => {
  const [qsoList, setQsoList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [isFilteredView, setIsFilteredView] = useState(false);
  const [indicativeCount, setIndicativeCount] = useState({});
  const [selectedIndicative, setSelectedIndicative] = useState('');
  const inputRef = useRef(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchQSOs();
  }, []);

  useEffect(() => {
    updateIndicativeCount(); // Update indicative count whenever qsoList or selectedIndicative changes
  }, [qsoList, selectedIndicative]);

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

  const updateIndicativeCount = () => {
    const countMap = {};
    qsoList.forEach(qso => {
      const { callsign } = qso;
      if (callsign && typeof callsign === 'string') {
        countMap[callsign] = countMap[callsign] ? countMap[callsign] + 1 : 1;
      }
    });
    setIndicativeCount(countMap);
  };

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    setSelectedSuggestionIndex(-1);
    if (term) {
      const newSuggestions = getSuggestions(term);
      setSuggestions(newSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const getSuggestions = (term) => {
    const trimmedTerm = term.trim();
    if (trimmedTerm === '') {
      return [];
    }

    const pattern = trimmedTerm.replace(/\?/g, '[a-zA-Z0-9]');
    const regex = new RegExp(`^${pattern}`, 'i');

    const fields = ['callsign', 'rst_received', 'rst_sent', 'op', 'qth', 'comments'];

    return qsoList.flatMap(qso =>
      fields.flatMap(field =>
        regex.test(qso[field]?.toString()) ? [{ field, value: qso[field], qso }] : []
      )
    ).slice(0, 10);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion.value.toString());
    setSuggestions([]);
    setQsoList([suggestion.qso]); // Show only the selected QSO
    setIsFilteredView(true); // Indicate that we are in filtered view
    setSelectedIndicative(suggestion.qso.callsign); // Set selected indicative

    // Update indicative count with the updated qsoList
    const updatedIndicativeCount = {
      ...indicativeCount,
      [suggestion.qso.callsign]: (indicativeCount[suggestion.qso.callsign] || 0) + 1
    };
    setIndicativeCount(updatedIndicativeCount);

    // Display success message
    setSuccessMessage(`You worked ${suggestion.qso.callsign} ${updatedIndicativeCount[suggestion.qso.callsign]} times.`);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedSuggestionIndex(prevIndex =>
        prevIndex > 0 ? prevIndex - 1 : suggestions.length - 1
      );
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedSuggestionIndex(prevIndex =>
        prevIndex < suggestions.length - 1 ? prevIndex + 1 : 0
      );
    } else if (e.key === 'Enter' && suggestions.length > 0) {
      if (selectedSuggestionIndex !== -1) {
        handleSuggestionClick(suggestions[selectedSuggestionIndex]);
      }
    }
  };

  const handleGoBack = () => {
    setSearchTerm('');
    setSuggestions([]);
    setIsFilteredView(false);
    setSelectedIndicative(''); // Reset selected indicative
    fetchQSOs(); // Fetch all QSOs again
  };

  return (
    <div className="App">
      <Header />
      <main>
        <div className="logged-qso-header">
          <h2>Logged QSOs</h2>
          <div className="search-container">
            <input
              type="text"
              placeholder="Search QSOs..."
              value={searchTerm}
              autoComplete="on"
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              className="qso-search-bar"
              ref={inputRef}
            />
            {suggestions.length > 0 && (
              <ul className="suggestions-list">
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className={`suggestion-item ${index === selectedSuggestionIndex ? 'selected' : ''}`}
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion.field}: {suggestion.value}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        {successMessage && <p className="success-message">{successMessage}</p>}
        {isFilteredView && selectedIndicative && indicativeCount[selectedIndicative] !== undefined && (
          <div className="indicative-count">
            <p>
              You worked {selectedIndicative} {indicativeCount[selectedIndicative]} times.
            </p>
          </div>
        )}
        <QsoList qsoList={qsoList} searchTerm={searchTerm} loading={loading} />
        {isFilteredView && (
          <button onClick={handleGoBack} className="go-back-button">
            Go back
          </button>
        )}
        <div className="go-back">
          <p><a href="/">Back to Home</a></p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AllQsos;
