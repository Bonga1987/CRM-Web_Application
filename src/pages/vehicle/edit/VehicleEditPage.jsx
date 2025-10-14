import "./VehicleEditPage.css";
import VehicleView from "../../../components/vehicle/VehicleView";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ManagerContext } from "../../../context/ManagerContext";

export default function VehicleEditPage({}) {
  const { vehicleid } = useParams();
  const [vehicle, setVehicle] = useState({
    vehicleid: vehicleid,
    make: "",
    model: "",
    year: "",
    category: "",
    color: "",
    seats: "",
    mileage: "",
    availability: true,
    isinmaintenance: false,
    priceperday: "",
    platenumber: "",
    vehicleimage: "",
    vehicliemagemoble: "",
    features: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [vehicleImage, setVehicleImage] = useState(null);
  const [vehicleFile, setVehicleFile] = useState(null);
  const { notifySuccess, notifyError, BASE_URL, BASE_URL_UPLOAD } =
    useContext(ManagerContext);
  const url = `${BASE_URL}/vehicles`;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVehicle((prev) => ({ ...prev, [name]: value }));
  };

  const validateVehicle = (vehicle) => {
    const errors = {};

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
        "plate number must be alphanumeric and must end with GP (e.g, ABC 123 GP)";
    }

    return errors;
  };

  const getVehicle = async () => {
    try {
      const response = await axios.get(`${url}/${vehicleid}`);
      if (response.status === 200) {
        if (response.data !== false) {
          setVehicle(response.data[0]); // store the vehicle in state
        }
      }
    } catch (error) {
      console.error("Error fetching vehicle:", error);
    }
  };

  useEffect(() => {
    getVehicle();
  }, []);

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

    const errors = validateVehicle(vehicle);
    if (Object.keys(errors).length > 0) {
      console.log("Validation failed:", errors);
      setFormErrors(errors); // store errors in state to show in UI
      return;
    }

    try {
      //2 transaction to upload vehicle data
      //3 upload vehicle details
      console.log(vehicle);
      const response = await axios.post(`${url}/update`, vehicle);

      if (response.status === 200) {
        if (response.data !== false && response.data.length !== 0) {
          //upload the vehicle image
          const vehicleid = response.data[0].vehicleid;
          const formData = new FormData();
          formData.append("vehicleImage", vehicleFile);

          const responseImage = await axios.post(
            `${BASE_URL_UPLOAD}/upload/vehicle/${vehicleid}`,
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );

          setVehicleImage(responseImage.data.url); // set uploaded image URL

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
      <img
        src={vehicle.vehicleimage ? vehicle.vehicleimage : null} // replace with your actual image field
        alt="Vehicle"
        style={{
          display: "block", // allows margin auto to center
          margin: "20px auto", // centers horizontally
          width: "337px", // adjust size (not too big)
          height: "150px", // keep square for round shape
          objectFit: "contain", // crop nicely
          boxShadow: "0 4px 8px rgba(0,0,0,0.2)", // subtle shadow
          background: "white",
        }}
      />

      <VehicleView
        vehicle={vehicle}
        formErrors={formErrors}
        handleChange={handleChange}
        setVehicleFile={setVehicleFile}
      ></VehicleView>
      <div className="form-actions">
        <button type="submit" className="save" onClick={handleUpload}>
          Save
        </button>
      </div>
    </>
  );
}
