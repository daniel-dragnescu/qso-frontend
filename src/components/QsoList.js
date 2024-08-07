import React, { useState, useRef, useEffect } from 'react';

const QsoList = ({ qsoList, searchTerm, loading, onEdit, onDelete }) => {
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const dropdownRef = useRef(null); // Ref for the dropdown menu

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  const filterQsoList = (list, term) => {
    if (!term || typeof term !== 'string') return list; // Ensure term is a valid string

    const escapedTerm = escapeRegExp(term.trim());
    const pattern = escapedTerm.replace(/\?/g, '[0-9]');
    const regex = new RegExp(pattern, 'i'); // Case insensitive

    return list.filter((qso) =>
      Object.values(qso).some((value) => {
        if (typeof value === 'string') {
          return regex.test(value);
        } else if (typeof value === 'number' && Number.isInteger(value)) {
          return regex.test(value.toString());
        }
        return false;
      })
    );
  };

  const escapeRegExp = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  const filteredQsoList = filterQsoList(qsoList, searchTerm);

  const toggleDropdown = (index) => {
    setDropdownOpen(dropdownOpen === index ? null : index);
  };

  return (
    <section className="qso-list">
      {qsoList.length === 0 && (
        <h3>There are no Logged QSOs yet.</h3>
      )}
      {filteredQsoList.length === 0 && searchTerm && (
        <h3></h3>
      )}
      {filteredQsoList.length > 0 && (
        <ul>
          {filteredQsoList.map((qso, index) => (
            <li key={index} className="qso-list-item">
              <div className="qso-item">
                <strong>Callsign:&nbsp;</strong>
                {qso.callsign}
              </div>
              <div className="qso-item">
                <strong>RST Received:&nbsp;</strong>
                {qso.rst_received}
              </div>
              <div className="qso-item">
                <strong>RST Sent:&nbsp;</strong>
                {qso.rst_sent}
              </div>
              <div className="qso-item">
                <strong>Operator:&nbsp;</strong>
                {qso.op}
              </div>
              <div className="qso-item">
                <strong>Location:&nbsp;</strong>
                {qso.qth}
              </div>
              <div className="qso-item">
                <strong>Comments:&nbsp;</strong>
                {qso.comments}
              </div>
              <div className="actions" ref={dropdownRef}>
                <i className="fas fa-ellipsis-h" onClick={() => toggleDropdown(index)}></i>
                {dropdownOpen === index && (
                  <div className="dropdown-menu" ref={dropdownRef}>
                    <button 
                      className="dropdown-item" 
                      onClick={() => { 
                        onEdit(qso);
                      }}
                    >
                      Edit
                    </button>
                    <button 
                      className="dropdown-item" 
                      onClick={() => { 
                        onDelete(qso); 
                      }}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default QsoList;
