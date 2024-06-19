import React from 'react';

const QsoList = ({ qsoList, loading }) => {
  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <section className="qso-list">
      <h2>Logged QSOs</h2>
      <ul>
        {qsoList.map((qso, index) => (
          <li key={index} className="qso-list-item">
            <div className="qso-item"><strong>Callsign:&nbsp;</strong>{qso.callsign}</div>
            <div className="qso-item"><strong>RST Received:&nbsp;</strong>{qso.rst_received}</div>
            <div className="qso-item"><strong>RST Sent:&nbsp;</strong>{qso.rst_sent}</div>
            <div className="qso-item"><strong>Operator:&nbsp;</strong>{qso.op}</div>
            <div className="qso-item"><strong>Location:&nbsp;</strong>{qso.qth}</div>
            <div className="qso-item"><strong>Comments:&nbsp;</strong>{qso.comments}</div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default QsoList;
