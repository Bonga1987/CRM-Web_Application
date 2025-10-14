import { useContext } from "react";
import BookingView from "../../booking/BookingView";
import axios from "axios";
import { ManagerContext } from "../../../context/ManagerContext";

export default function BookingCheckoutModal({
  show,
  onClose,
  onConfirm,
  bookingDetails,
}) {
  if (!show) return null;
  const { staff, notifySuccess, notifyError, BASE_URL } =
    useContext(ManagerContext);
  const url = `${BASE_URL}/bookings`;

  const handleCheckOut = async () => {
    try {
      const response = await axios.post(`${url}/checkout`, {
        bookingid: bookingDetails.bookingid,
        handledbystaffid: staff.staffid,
      });

      if (response.status === 200) {
        if (response.data !== false) {
          console.log(
            "Vehicle checked out for BookingID: ",
            response.data[0].bookingid
          );
          notifySuccess(
            `Vehicle: ${bookingDetails.make} ${bookingDetails.model} checked for customer: ${bookingDetails.fullname}`
          );
          onConfirm();
        } else {
          console.log("Failed to check out vehicle");
          notifyError("Failed to check out vehicle");
        }
      }
    } catch (error) {
      console.error("Error Checking vehicle out:", error);
    }
  };

  return (
    <>
      <div className="modal-overlay">
        <div className="modal-content">
          <BookingView title={"Checkout"} bookingDetails={bookingDetails} />
          {/* Action Buttons */}
          <div className="actions">
            <button className="btn cancel" onClick={onClose}>
              Cancel
            </button>
            <button className="btn confirm" onClick={handleCheckOut}>
              Check out
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
