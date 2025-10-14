import "./BookingDetailsPage.css";
import BoookingView from "../../../components/booking/BookingView";
import { useState, useEffect, useContext } from "react";
import DamageModal from "../../../components/modals/damage/DamageModal";
import { useParams } from "react-router-dom";
import axios from "axios";
import ContinueCheckoutModal from "../../../components/modals/damage/ContinueCheckoutModal";
import { ManagerContext } from "../../../context/ManagerContext";

export default function BookingDetailsPage() {
  const { bookingid } = useParams();
  const [isChecked, setIsChecked] = useState(false);
  const [isLastModal, setIsLastModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [booking, setBooking] = useState({});
  const [selectedDamages, setSelectedDamages] = useState([]);
  const { staff, notifySuccess, notifyError, BASE_URL } =
    useContext(ManagerContext);
  const url = `${BASE_URL}/bookings`;

  useEffect(() => {
    const getBookingDetails = async () => {
      try {
        const response = await axios.get(`${url}/booking/${bookingid}`);

        if (response.status === 200) {
          if (response.data !== false) {
            setBooking(response.data[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching booking details:", error);
      }
    };

    getBookingDetails();
  }, []);

  const handleCheckIn = async () => {
    const checkin = {
      bookingid: booking.bookingid,
      priceperday: booking.priceperday,
      damageReports: selectedDamages,
      checkedinbystaffid: staff.staffid,
    };
    try {
      const response = await axios.post(`${url}/checkin`, checkin);

      if (response.status === 200) {
        notifySuccess(
          `Checkin successfull and invoice generated, vehicle: ${booking.make} ${booking.model} , invoiceID: ${response.data.invoiceid}`
        );

        return true;
      }
      notifySuccess("Failed to checkin vehicle, please try again");
      return false;
    } catch (error) {
      console.error("Error checking in vehicle: ", error);
      notifyError(
        "Error checking in vehicle, refresh page and please try again"
      );
      return false;
    }
  };

  const handleCheckInClick = () => {
    if (isChecked) {
      //damagage report
      setShowModal(true);
    } else {
      //handle checkout
      handleCheckIn();
    }
  };

  useEffect(() => {
    console.log(selectedDamages);
  }, [selectedDamages]);

  return (
    <>
      <BoookingView bookingDetails={booking} />
      {booking.status === "Active" ? (
        <>
          {/* New checkbox section */}
          <div className="damage-check">
            <input
              type="checkbox"
              id="damage"
              onChange={() => setIsChecked(!isChecked)}
            />
            <label htmlFor="damage">Are there any damages?</label>
          </div>

          {/* Action Buttons */}
          <div className="actions">
            <button className="btn confirm" onClick={handleCheckInClick}>
              Check in
            </button>
            <DamageModal
              setSelectedDamages={setSelectedDamages}
              selectedDamages={selectedDamages}
              show={showModal}
              onClose={() => {
                setShowModal(false);
                setIsLastModal(true);
              }}
              onConfirm={() => setShowModal(false)}
              setIsLastModal={setIsLastModal}
            />
            <ContinueCheckoutModal
              isOpen={isLastModal}
              onClose={() => setIsLastModal(false)}
              onConfirm={() => setIsLastModal(false)}
              handleCheckIn={handleCheckIn}
              isDeleteVehicle={false}
            />
            {/* continue modal and perform checkin */}
          </div>
        </>
      ) : (
        <></>
      )}
    </>
  );
}
