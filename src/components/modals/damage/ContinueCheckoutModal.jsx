import { useContext } from "react";
import { ManagerContext } from "../../../context/ManagerContext";

export default function ContinueCheckoutModal({
  isDeleteVehicle,
  isOpen,
  onClose,
  onConfirm,
  handleCheckIn,
  handleDeleteVehicle,
}) {
  if (!isOpen) return null;

  const { notifySuccess, notifyError } = useContext(ManagerContext);

  const handleConfirm = () => {
    if (isDeleteVehicle) {
      const isDeleteSuccess = handleDeleteVehicle();
      if (isDeleteSuccess) {
        onConfirm();
      } else {
        notifyError(
          "Problem with the last step of the deactivating vehicle, please try again"
        );
      }
    } else {
      const isCheckinSuccess = handleCheckIn();
      if (isCheckinSuccess) {
        onConfirm();
      } else {
        notifyError("Problem with the last step of the checkin process");
      }
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content small-modal">
        <h3 className="page-title">
          {isDeleteVehicle
            ? "Are you sure you want to deactivate the vehicle"
            : "This is the final step, click the continue button to complete checkout"}
        </h3>

        <div className="modal-actions">
          <button onClick={onClose} className="cancel">
            No
          </button>
          <button onClick={handleConfirm} className="save">
            Yes
          </button>
        </div>
      </div>
    </div>
  );
}
