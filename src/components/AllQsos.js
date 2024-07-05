import React, { useEffect, useState, useRef } from 'react';
import QsoList from './QsoList';
import Header from './Header';
import Footer from './Footer';
import ConfirmModal from './ConfirmModal';

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
  const [editingQso, setEditingQso] = useState(null);
  const [qsToDelete, setQsToDelete] = useState(null);
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);

  // Function to disable scrolling
  const disableScroll = () => {
    document.body.style.overflow = 'hidden';
  };

  // Function to enable scrolling
  const enableScroll = () => {
    document.body.style.overflow = 'auto';
  };

  useEffect(() => {
    fetchQSOs();
    loadPersistedCounts(); // Load counts from localStorage on initial mount
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
    qsoList.forEach((qso) => {
      const { callsign } = qso;
      if (callsign && typeof callsign === 'string') {
        countMap[callsign] = countMap[callsign] ? countMap[callsign] + 1 : 1;
      }
    });
    setIndicativeCount(countMap);
    persistCounts(countMap); // Persist counts to localStorage after updating
  };

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    setSelectedSuggestionIndex(-1);
    if (term) {
      const newSuggestions = getSuggestions(term);
      setSuggestions(newSuggestions);
      setIsFilteredView(true); // Set filtered view if there's a search term
    } else {
      setSuggestions([]);
      setIsFilteredView(false); // Clear filtered view if search term is cleared
      setSelectedIndicative('');
      setSuccessMessage(''); // Clear success message when search term is cleared
    }
  };

  const getSuggestions = (term) => {
    const trimmedTerm = term.trim();
    if (trimmedTerm === '') {
      return [];
    }
    if (
      trimmedTerm === '*' ||
      trimmedTerm === '(' ||
      trimmedTerm === ')' ||
      trimmedTerm === '+' ||
      trimmedTerm === '\\' ||
      trimmedTerm === '['
    ) {
      return [];
    }

    const escapedTerm = escapeRegExp(trimmedTerm); // Escape special characters

    const pattern = escapedTerm.replace(/\?/g, '[a-zA-Z0-9]');
    const regex = new RegExp(`^${pattern}`, 'i');

    const fields = ['callsign', 'rst_received', 'rst_sent', 'op', 'qth', 'comments'];

    return qsoList
      .flatMap((qso) =>
        fields.flatMap((field) =>
          regex.test(qso[field]?.toString())
            ? [{ field, value: qso[field], qso }]
            : []
        )
      )
      .slice(0, 10);
  };

  const escapeRegExp = (string) => {
    return string.replace(/[.*+^${}()|[\]\\]/g, '\\$&');
  };

  const suggestionsListRef = useRef(null);

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion.value.toString());
    setSuggestions([]);
    setSelectedSuggestionIndex(-1); // Reset selected suggestion index
  
    // Find the index of the selected QSO in qsoList
    const qsoIndex = qsoList.findIndex((qso) => qso.callsign === suggestion.qso.callsign);
  
    if (qsoIndex !== -1) {
      // Update the qsoList with the incremented count for the selected QSO
      const updatedQsoList = [...qsoList];
      updatedQsoList[qsoIndex] = { ...updatedQsoList[qsoIndex], count: (updatedQsoList[qsoIndex].count || 0) + 1 };
      setQsoList(updatedQsoList);
  
      // Update indicative count with the updated qsoList
      updateIndicativeCount();
  
      // Determine the correct wording for the success message
      const count = updatedQsoList[qsoIndex].count;
      const timesText = count === 1 ? 'time' : 'times';
  
      // Display success message
      setSuccessMessage(`You worked ${suggestion.qso.callsign} ${count} ${timesText}.`);
    }
  
    // Set selected indicative for displaying count if in filtered view
    setSelectedIndicative(suggestion.qso.callsign);
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedSuggestionIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : suggestions.length - 1
      );
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedSuggestionIndex((prevIndex) =>
        prevIndex < suggestions.length - 1 ? prevIndex + 1 : 0
      );
    } else if (e.key === 'Enter' && suggestions.length > 0) {
      if (selectedSuggestionIndex !== -1) {
        handleSuggestionClick(suggestions[selectedSuggestionIndex]);
      }
    }
  };
  
  const handleMouseEnter = (index) => {
    setSelectedSuggestionIndex(index);
  };
  
  useEffect(() => {
    if (selectedSuggestionIndex !== -1 && suggestionsListRef.current) {
      const selectedSuggestion = suggestionsListRef.current.children[selectedSuggestionIndex];
      if (selectedSuggestion) {
        selectedSuggestion.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [selectedSuggestionIndex]);

  const handleGoBack = () => {
    setSearchTerm('');
    setSuggestions([]);
    setIsFilteredView(false);
    setSelectedIndicative('');
    setSuccessMessage(''); // Clear success message when going back
  };

  const persistCounts = (counts) => {
    localStorage.setItem('qsoCounts', JSON.stringify(counts));
  };

  const loadPersistedCounts = () => {
    const persistedCounts = localStorage.getItem('qsoCounts');
    if (persistedCounts) {
      setIndicativeCount(JSON.parse(persistedCounts));
    }
  };

  const handleEdit = (qso) => {
    setEditingQso(qso);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingQso({ ...editingQso, [name]: value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:3500/qso/${editingQso._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingQso),
      });

      if (!response.ok) {
        throw new Error('Failed to update QSO');
      }

      // Update qsoList with the updated QSO
      const updatedQsoList = qsoList.map((qso) =>
        qso._id === editingQso._id ? editingQso : qso
      );
      setQsoList(updatedQsoList);
      setEditingQso(null); // Clear editing state
    } catch (error) {
      console.error('Error updating QSO:', error.message);
    }
  };

  const handleDeleteClick = (qso) => {
    setQsToDelete(qso);
    setIsConfirmModalVisible(true);
    disableScroll(); // Call function to disable scrolling when modal is opened
  };

  const handleConfirmDelete = async () => { 
    if (qsToDelete) {
      const { _id } = qsToDelete;
      try {
        const response = await fetch(`http://localhost:3500/qso/${_id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete QSO');
        }

        const updatedQsoList = qsoList.filter((qso) => qso._id !== _id);
        setQsoList(updatedQsoList);
        setQsToDelete(null);
        setIsConfirmModalVisible(false);
        enableScroll(); // Re-enable scrolling after confirming deletion
        setSuccessMessage('QSO deleted successfully.');

        setTimeout(() => {
          setSuccessMessage('');
        }, 3000); // Clear success message after 3 seconds
      } catch (error) {
        console.error('Error deleting QSO:', error.message);
        setIsConfirmModalVisible(false);
        enableScroll(); // Re-enable scrolling even if deletion fails
      }
    }
  };

  const handleCancelDelete = () => {
    setIsConfirmModalVisible(false);
    setQsToDelete(null);
    enableScroll(); // Call function to enable scrolling when modal is closed
  };

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className="App">
      <Header />
      <main>
        {!editingQso && (
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
                <ul className="suggestions-list" ref={suggestionsListRef}>
                  {suggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      className={`suggestion-item ${index === selectedSuggestionIndex ? 'selected' : ''}`}
                      onClick={() => handleSuggestionClick(suggestion)}
                      onMouseEnter={() => handleMouseEnter(index)}
                      onMouseLeave={() => setSelectedSuggestionIndex(-1)} // Reset selection on mouse leave
                    >
                      {suggestion.field}: {suggestion.value}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
  
        {successMessage && !editingQso && (
          <p className="success-message">{successMessage}</p>
        )}
  
        {isFilteredView && selectedIndicative && indicativeCount[selectedIndicative] !== undefined && !editingQso && (
          <div className="indicative-count">
            {/* <p>
              You worked {selectedIndicative} {indicativeCount[selectedIndicative]} times.
            </p> */}
          </div>
        )}
  
        {isConfirmModalVisible && (
          <ConfirmModal
            message="Are you sure you want to delete this QSO?"
            onConfirm={handleConfirmDelete}
            onCancel={handleCancelDelete}
          />
        )}
  
        {editingQso ? (
          <div className="edit-qso-form">
            <h3>Edit QSO</h3>
            <form onSubmit={handleEditSubmit}>
              <div>
                <label>Callsign:</label>
                <input
                  type="text"
                  name="callsign"
                  value={editingQso.callsign}
                  onChange={handleEditChange}
                />
              </div>
              <div>
                <label>RST Received:</label>
                <input
                  type="text"
                  name="rst_received"
                  value={editingQso.rst_received}
                  onChange={handleEditChange}
                />
              </div>
              <div>
                <label>RST Sent:</label>
                <input
                  type="text"
                  name="rst_sent"
                  value={editingQso.rst_sent}
                  onChange={handleEditChange}
                />
              </div>
              <div>
                <label>Operator:</label>
                <input
                  type="text"
                  name="op"
                  value={editingQso.op}
                  onChange={handleEditChange}
                />
              </div>
              <div>
                <label>Location:</label>
                <input
                  type="text"
                  name="qth"
                  value={editingQso.qth}
                  onChange={handleEditChange}
                />
              </div>
              <div>
                <label>Comments:</label>
                <input
                  type="text"
                  name="comments"
                  value={editingQso.comments}
                  onChange={handleEditChange}
                />
              </div>
              <button className='save-button'>Save</button>
              <button className="edit-cancel" onClick={() => setEditingQso(null)}>Cancel</button>
            </form>
          </div>
        ) : (
          <QsoList qsoList={qsoList} searchTerm={searchTerm} loading={loading} onEdit={handleEdit} onDelete={handleDeleteClick} />
        )}
  
        {isFilteredView && !editingQso && (
          <button onClick={handleGoBack} className="go-back-button">
            Go back
          </button>
        )}
  
        <div className="go-back">
          <p className="back-to-home">
            <a href="/create-new-qso">Create a New QSO</a>
          </p>
        </div>
  
        {/* Scroll to Top Button */}
        <button className="scroll-to-top" onClick={handleScrollToTop}>
          Back to Top
        </button>
      </main>
      <Footer />
    </div>
  );
  
}

export default AllQsos;

