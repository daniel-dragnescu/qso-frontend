import React, { useEffect, useRef } from 'react';

const ConfirmModal = ({ message, onConfirm, onCancel }) => {
  const [isVisible, setIsVisible] = React.useState(true);
  const modalRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        // Click outside the modal, apply animation and do not close
        modalRef.current.classList.add('modal-animation');
      }
    };

    document.addEventListener('click', handleOutsideClick);

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  const handleConfirm = () => {
    onConfirm();
    setIsVisible(false);
  };

  const handleCancel = () => {
    onCancel();
    setIsVisible(false);
  };

  const handleModalClick = (e) => {
    e.stopPropagation(); // Prevent clicks inside modal from closing it
  };

  return (
    <>
      {isVisible && (
        <div className="modal-overlay">
          <div ref={modalRef} className="modal" onClick={handleModalClick}>
            <div className="modal-content">
              <p className="confirm-message">{message}</p>
              <hr />
            </div>
            <div className="modal-buttons">
              <button className="confirm-button" onClick={handleConfirm}>
                Confirm
              </button>
              <button className="cancel-button" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ConfirmModal;
