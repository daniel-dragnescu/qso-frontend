import React from 'react';

const QsoList = ({ qsoList, searchTerm, loading, onEdit, onDelete }) => {
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
              <button className="edit-qso-button" onClick={() => onEdit(qso)}>Edit</button>
              <button className="delete-qso-button" onClick={() => onDelete(qso)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default QsoList;
