import "./BookingPage.css";
import { Link } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import BookingCheckoutModal from "../../../components/modals/booking/BookingCheckoutModal";
import DamageModal from "../../../components/modals/damage/DamageModal";
import axios from "axios";
import { ManagerContext } from "../../../context/ManagerContext";
import ResponsiveTable from "../../../components/table/ResponsiveTable";

export default function BookingsPage() {
  const [showModal, setShowModal] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState({});
  const { formatedDate, BASE_URL, notifySuccess, notifyError } =
    useContext(ManagerContext);
  const [filterTerm, setFilterTerm] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBookingsData, setFilteredBookingsData] = useState([]);
  const url = `${BASE_URL}/bookings`;
  const [loading, setLoading] = useState(true); // loading state

  useEffect(() => {
    const getAllBookings = async () => {
      try {
        const response = await axios.get(url);

        if (response.status === 200) {
          if (response.data !== false) {
            setBookings(response.data);
            setFilteredBookingsData(response.data);
          }
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    getAllBookings();
  }, []);

  const handleCheckoutClick = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const handleCancelClick = async (bookingid) => {
    try {
      const response = await axios.post(`${url}/cancel`, { bookingid });

      if (response.status === 200) {
        if (response.data !== false) {
          notifySuccess("Booking cancelled");
        }
      } else {
        notifyError("Cancelling booking failed, please try again");
      }
    } catch (error) {
      console.error("Error fetching cancelling booking:", error);
    }
  };

  const headers = [
    "Booking ID",
    "Vehicle",
    "Customer",
    "Pickup date",
    "Dropoff date",
    "Actual return date",
    "Pickup location",
    "Dropoff location",
    "Status",
    "Actions",
  ];

  const rows = filteredBookingsData.map((booking) => ({
    "Booking ID": booking.bookingid,
    Vehicle: (
      <span className="link">
        {booking.make} {booking.model}
      </span>
    ),
    Customer: <span className="link">{booking.fullname}</span>,
    "Pickup date": formatedDate(booking.pickupdate),
    "Dropoff date": formatedDate(booking.dropoffdate),
    "Actual return date": formatedDate(booking.actualreturndate),
    "Pickup location": booking.pickuplocation,
    "Dropoff location": booking.dropofflocation,
    Status:
      booking.status === "Completed" ? (
        <span className="label">{booking.status}</span>
      ) : booking.status === "Overdue" ? (
        <span className="label-red">{booking.status}</span>
      ) : (
        <span>{booking.status}</span>
      ),
    Actions: (
      <>
        {booking.status === "Pending" ? (
          <>
            <button
              className="btn delete-btn"
              onClick={() => handleCheckoutClick(booking)}
            >
              Checkout
            </button>
            <button
              className="btn cancel-btn"
              onClick={() => handleCancelClick(booking?.bookingid)}
            >
              Cancel
            </button>
          </>
        ) : booking.status === "Active" ? (
          <Link
            className="btn edit-btn"
            to={`/BookingDetails/${booking.bookingid}`}
          >
            Checkin
          </Link>
        ) : null}
      </>
    ),
  }));

  useEffect(() => {
    // Filter bookings based on the search term
    const filteredBookings = bookings.filter((booking) =>
      booking.status.toLowerCase().includes(filterTerm.toLowerCase())
    );

    setFilteredBookingsData(filteredBookings);
  }, [filterTerm]);

  useEffect(() => {
    const filteredRows = bookings.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    setFilteredBookingsData(filteredRows);
  }, [searchTerm]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <section className="table-container">
      <header className="booking-table-header">
        <h2 className="booking-table-header-title">Bookings</h2>
        <div className="booking-table-header-actions">
          <input
            type="text"
            placeholder="Search here"
            className="search"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>
      <label style={{ display: "flex", alignItems: "center" }}>
        Filter:
        <select
          onChange={(e) => setFilterTerm(e.target.value)}
          className="form-control form-control-sm"
        >
          <option value={""}>Select filter</option>
          <option value={"Pending"}>Pending</option>
          <option value={"Active"}>Active</option>
          <option value={"Completed"}>Completed</option>
          <option value={"Overdue"}>Overdue</option>
          <option value={"Cancel"}>Cancel</option>
        </select>
      </label>
      <ResponsiveTable headers={headers} rows={rows} />
      <BookingCheckoutModal
        bookingDetails={selectedBooking}
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={() => setShowModal(false)}
      />
    </section>
  );
}
