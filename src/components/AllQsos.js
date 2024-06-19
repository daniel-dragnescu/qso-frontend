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
  const inputRef = useRef(null);
 

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
  
    // Replace "?" with a regex pattern for any letter or digit
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
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedSuggestionIndex(prevIndex =>
        prevIndex > 0 ? prevIndex - 1 : suggestions.length - 1
      );
      scrollSuggestionList();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedSuggestionIndex(prevIndex =>
        prevIndex < suggestions.length - 1 ? prevIndex + 1 : 0
      );
      scrollSuggestionList();
    } else if (e.key === 'Enter' && suggestions.length > 0) {
      if (selectedSuggestionIndex !== -1) {
        handleSuggestionClick(suggestions[selectedSuggestionIndex]);
      }
    }
  };

  const scrollSuggestionList = () => {
    if (inputRef.current && inputRef.current.parentNode) {
      const suggestionsList = inputRef.current.parentNode.querySelector('.suggestions-list');
      if (suggestionsList) {
        const selectedSuggestion = suggestionsList.querySelector('.selected');
        if (selectedSuggestion) {
          suggestionsList.scrollTop = selectedSuggestion.offsetTop - suggestionsList.offsetTop;
        }
      }
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const escapeRegExp = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  const handleGoBack = () => {
    setSearchTerm('');
    setSuggestions([]);
    setIsFilteredView(false);
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
        <QsoList qsoList={qsoList} searchTerm={searchTerm} loading={loading} />
        {isFilteredView && (
          <button onClick={handleGoBack} className="go-back-button">
            Go back
          </button>
        )}
        <p><a href="/">Back to Home</a></p>
      </main>
      <Footer />
    </div>
  );
};

export default AllQsos;
