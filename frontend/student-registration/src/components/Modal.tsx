// src/components/Modal.tsx
import React from "react";
import "./Modal.css"; // external styles

interface ModalProps {
  title?: string;
  message: string;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ title = "Notice", message, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{title}</h2>
        <p>{message}</p>
        <button onClick={onClose} className="modal-btn">OK</button>
      </div>
    </div>
  );
};

export default Modal;
