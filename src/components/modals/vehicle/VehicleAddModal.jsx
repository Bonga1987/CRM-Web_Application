import "./VehicleAddModal.css";
import VehicleView from "../../../components/vehicle/VehicleView";
import { useState, useContext } from "react";
import axios from "axios";
import { ManagerContext } from "../../../context/ManagerContext";

export default function VehicleAddModal({ show, onClose, onConfirm }) {
  if (!show) return null;
  const [vehicle, setVehicle] = useState({
    make: "",
    model: "",
    year: "",
    category: "",
    color: "",
    seats: "",
    mileage: "",
    availability: true,
    isInMaintenance: false,
    priceperday: "",
    platenumber: "",
    features: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [vehicleFile, setVehicleFile] = useState(null);
  const [vehicleImage, setVehicleImage] = useState(null);
  const { notifySuccess, notifyError, BASE_URL, BASE_URL_UPLOAD } =
    useContext(ManagerContext);
  const url = `${BASE_URL}/vehicles`;

  // Example of updating one field
  const handleChange = (e) => {
    const { name, value } = e.target;
    setVehicle((prev) => ({ ...prev, [name]: value }));
  };

  const validateVehicle = (vehicle, vehiclefile) => {
    const errors = {};

    if (!vehiclefile) {
      errors.image = "Please pick an image for the vehicle entry";
    }

    if (!vehicle.make || !/^[A-Za-z\s]{2,30}$/.test(vehicle.make)) {
      errors.make = "Only letters and spaces, 2–30 chars";
    }

    if (
      !vehicle.model.trim() ||
      !/^[A-Za-z0-9\s\-]{1,30}$/.test(vehicle.model)
    ) {
      errors.model = "Letters, numbers, spaces, and hyphens";
    }

    if (
      !vehicle.year ||
      isNaN(vehicle.year) ||
      vehicle.year < 1900 ||
      vehicle.year > new Date().getFullYear()
    ) {
      errors.year = "Enter a valid manufacturing year.";
    }

    if (!vehicle.color || !/^[a-zA-Z]+$/.test(vehicle.color)) {
      errors.color = "Color must only contain letters.";
    }

    if (!vehicle.category) {
      errors.category = "Category can not be empty";
    }

    if (
      !vehicle.seats ||
      isNaN(vehicle.seats) ||
      vehicle.seats < 1 ||
      vehicle.seats > 10
    ) {
      errors.seats = "Seats must be between 1 and 10";
    }

    if (
      !vehicle.mileage ||
      isNaN(vehicle.mileage) ||
      vehicle.mileage < 0 ||
      !/^\d{1,6}$/.test(vehicle.mileage)
    ) {
      errors.mileage = "Mileage must be 0 or up to 999999";
    }

    if (
      !vehicle.priceperday ||
      isNaN(vehicle.priceperday) ||
      vehicle.priceperday <= 0
    ) {
      errors.priceperday = "Price per day must be a positive number";
    }

    const alphanumericRegex = /^[A-Z]{3}\s?\d{3}\s?GP$/;
    if (!alphanumericRegex.test(vehicle.platenumber)) {
      errors.platenumber =
        "plate number must be alphanumeric and must end with GP(e.g, ABC 123 GP)";
    }

    return errors;
  };

  const handleUpload = async () => {
    //1 validation
    if (
      !vehicle.make.trim() &&
      !vehicle.model.trim() &&
      !vehicle.year &&
      !vehicle.category.trim() &&
      !vehicle.color.trim() &&
      !vehicle.seats &&
      !vehicle.mileage &&
      !vehicle.priceperday &&
      !vehicle.platenumber.trim()
    ) {
      notifyError("All fields are required");
      return;
    }

    let errors = validateVehicle(vehicle, vehicleFile);
    if (Object.keys(errors).length > 0) {
      console.log("Validation failed:", errors);
      setFormErrors(errors); // store errors in state to show in UI
      return;
    }

    try {
      //2 transaction to upload vehicle data
      //3 upload vehicle details
      const formData = new FormData();
      formData.append("vehicleImage", vehicleFile);

      const response = await axios.post(`${url}/add`, vehicle);

      if (response.status === 200) {
        if (response.data !== false && response.data.length !== 0) {
          setVehicle({
            make: "",
            model: "",
            year: "",
            category: "",
            color: "",
            seats: "",
            mileage: "",
            availability: true,
            isInMaintenance: false,
            priceperday: "",
            platenumber: "",
          });

          //upload the vehicle image
          const vehicleid = response.data[0].vehicleid;

          const responseImage = await axios.post(
            `${BASE_URL_UPLOAD}/upload/vehicle/${vehicleid}`,
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );

          setVehicleImage(responseImage.data.url); // set uploaded image URL
          onConfirm();

          notifySuccess("Upload Success");
        } else {
          notifyError("Upload Failed");
        }
      }
    } catch (error) {
      console.error("Upload error:", error.message);
      notifyError("Something went wrong while adding the vehicle");
    }
  };

  return (
    <>
      <div className="modal-overlay">
        <div className="modal-content">
          <VehicleView
            title={"Add Vehicle"}
            handleChange={handleChange}
            vehicle={vehicle}
            formErrors={formErrors}
            setVehicleFile={setVehicleFile}
            vehicleImage={vehicleImage}
          />
          <div className="modal-actions">
            <button className="cancel" onClick={onClose}>
              Cancel
            </button>
            <button className="save" onClick={handleUpload}>
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
