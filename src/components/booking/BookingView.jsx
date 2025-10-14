import { useContext } from "react";
import { ManagerContext } from "../../context/ManagerContext";

export default function BookingView({ title, bookingDetails }) {
  const { formatedDate } = useContext(ManagerContext);

  const replaceWithLocalhost = (url) => {
    if (!url) return null;
    return url.replace("http://10.0.2.2:4000", "http://localhost:4000");
  };

  return (
    <>
      <h3 className="page-title">{title}</h3>
      {/* Pickup/Dropoff Details */}
      <div className="section-column">
        <div className="row">
          <span>
            <b>Pickup date:</b> {formatedDate(bookingDetails.pickupdate)}
          </span>
          <span>
            <b>Dropoff date:</b> {formatedDate(bookingDetails.dropoffdate)}
          </span>
        </div>
        {/* <div className="row">
          <span>
            <b>Pickup time:</b>
          </span>
          <span>
            <b>
              <b>Dropoff time:</b>
            </b>
          </span>
        </div> */}
        <div className="row">
          <span>
            <b>Pickup location:</b> {bookingDetails.pickuplocation}
          </span>
          <span>
            <b>Dropoff location:</b> {bookingDetails.dropofflocation}
          </span>
        </div>
        <div className="row">
          <span>
            <b>Actual return date:</b>{" "}
            {formatedDate(bookingDetails.actualreturndate)}
          </span>
          <span style={{ color: "blue" }}>
            <b style={{ color: "black" }}>Status:</b> {bookingDetails.status}
          </span>
        </div>
      </div>

      {/* Vehicle Details */}
      <div className="section-row vehicle-section">
        <img
          src={bookingDetails.vehicleimage}
          alt="Car"
          className="car-image"
        />
        <div className="vehicle-info">
          <div className="row">
            <span>
              <b>Make: </b>
              {bookingDetails.make}
            </span>
            <span>
              <b>Availability:</b> {bookingDetails.availability ? "YES" : "NO"}
            </span>
          </div>
          <div className="row">
            <span>
              <b>Model:</b> {bookingDetails.model}
            </span>
            <span>
              <b>Seats</b> {bookingDetails.seats}
            </span>
          </div>
          <div className="row">
            <span>
              <b>Year: </b>
              {bookingDetails.year}
            </span>
            <span>
              <b>Mileage:</b> {bookingDetails.mileage}
            </span>
          </div>
          <div className="row">
            <span>
              <b>Feature: </b>
              {bookingDetails.features}
            </span>
            <span>
              <b>Category: </b>
              {bookingDetails.category}
            </span>
          </div>
          <div className="row">
            <span>
              <b>Color: </b>
              {bookingDetails.color}
            </span>
            <span>
              <b>Price: </b>
              {bookingDetails.priceperday}
            </span>
          </div>
        </div>
      </div>

      {/* Customer Details */}
      <div className="section-row customer-section">
        <div className="avatar">
          <img
            src={replaceWithLocalhost(bookingDetails.profileimage)}
            alt="Profile Image"
          />
        </div>
        <div className="customer-info">
          <p>
            <b>Name:</b> {bookingDetails.fullname}
          </p>
          <p>
            <b>Address:</b> {bookingDetails.address}
          </p>
          <p>
            <b>Email:</b> {bookingDetails.email}
          </p>
          <p>
            <b>License:</b> {bookingDetails.driverslicense}
          </p>
        </div>
      </div>
    </>
  );
}
