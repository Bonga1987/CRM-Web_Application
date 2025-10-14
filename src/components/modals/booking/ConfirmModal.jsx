export default function ConfirmModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content small-modal">
        <h3 className="page-title">Do you want to add another damage?</h3>

        <div className="modal-actions">
          <button onClick={onConfirm} className="cancel">
            No
          </button>
          <button onClick={onClose} className="save">
            Yes
          </button>
        </div>
      </div>
    </div>
  );
}
