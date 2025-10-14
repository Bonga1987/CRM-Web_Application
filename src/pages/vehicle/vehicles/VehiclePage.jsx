import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import "./VehiclePage.css";
import VehicleAddModal from "../../../components/modals/vehicle/VehicleAddModal";
import axios from "axios";
import { ManagerContext } from "../../../context/ManagerContext";
import ContinueCheckoutModal from "../../../components/modals/damage/ContinueCheckoutModal";
import ResponsiveTable from "../../../components/table/ResponsiveTable";

export default function VehiclePage() {
  const [showModal, setShowModal] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const { notifySuccess, notifyError, BASE_URL } = useContext(ManagerContext);
  const url = `${BASE_URL}/vehicles`;
  const [isLastModal, setIsLastModal] = useState(false);
  const [vehicleid, setVehicleid] = useState();
  const [status, setStatus] = useState();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredVehicleData, setFilteredVehicleData] = useState([]);
  const [loading, setLoading] = useState(true); // loading state

  useEffect(() => {
    const getAllVehicles = async () => {
      try {
        const response = await axios.get(`${url}/All`);

        if (response.status === 200) {
          if (response.data !== false) {
            setVehicles(response.data); // store the vehicles in state
            setFilteredVehicleData(response.data);
          }
        }
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      } finally {
        setLoading(false); // stop loading once fetch is complete
      }
    };

    getAllVehicles();
  }, []);

  const handleDelete = async (vehicleid, status) => {
    const isactive = status ? false : true;
    const availability = status ? false : true;
    try {
      const response = await axios.post(`${url}/updateisActive`, {
        isactive,
        vehicleid,
        availability,
      });

      if (response.status === 200) {
        if (response.data !== false) {
          isactive
            ? notifySuccess("Vehicle activated")
            : notifySuccess("Vehicle deactivated");
          return true;
        }
      } else {
        notifyError("Failed to deactivate vehicle");
        return false;
      }
    } catch (error) {
      isactive
        ? console.error("Activate error:", error.message)
        : console.error("Deactivate error:", error.message);

      isactive
        ? notifyError("Something went wrong while activating the vehicle")
        : notifyError("Something went wrong while deactivating the vehicle");
      return false;
    }
  };

  const setShowConfirmationModal = (vehicleid, status) => {
    setStatus(status);
    setVehicleid(vehicleid);

    if (status) {
      setIsLastModal(true);
    } else {
      handleDelete(vehicleid, status);
    }
  };

  const headers = [
    "Vehicle ID",
    "Make",
    "Model",
    "Category",
    "Color",
    "IsActive",
    "Year",
    "Price/day",
    "InMaintenance",
    "Available",
    "Actions",
  ];

  // Map vehicles to row objects
  const rows = filteredVehicleData.map((vehicle) => ({
    "Vehicle ID": vehicle.vehicleid,
    Make: vehicle.make,
    Model: vehicle.model,
    Color: vehicle.color,
    Category: vehicle.category,
    IsActive: vehicle.isactive ? (
      <span className="label">TRUE</span>
    ) : (
      <span className="label-red">FALSE</span>
    ),
    Year: vehicle.year,
    "Price/day": vehicle.priceperday,
    InMaintenance: vehicle.isinmaintenance ? (
      <span className="label-red">TRUE</span>
    ) : (
      <span className="label">FALSE</span>
    ),
    Available: vehicle.availability ? (
      <span className="label">TRUE</span>
    ) : (
      <span className="label-red">FALSE</span>
    ),
    Actions: (
      <>
        <Link className="btn edit-btn" to={`/VehicleEdit/${vehicle.vehicleid}`}>
          Edit
        </Link>
        <button
          className={vehicle.isactive ? "btn delete-btn" : "btn edit-btn"}
          onClick={() =>
            setShowConfirmationModal(vehicle.vehicleid, vehicle.isactive)
          }
        >
          {vehicle.isactive ? "Deactivate" : "Activate"}
        </button>
      </>
    ),
  }));

  useEffect(() => {
    const filteredRows = vehicles.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    setFilteredVehicleData(filteredRows);
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
      <header className="vehicle-table-header">
        <h2 className="vehicle-table-header-title">Vehicles</h2>
        <div className="vehicle-table-header-actions">
          <input
            type="text"
            placeholder="Search here"
            className="search"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="icon" onClick={() => setShowModal(true)}>
            +
          </button>
          <VehicleAddModal
            show={showModal}
            onClose={() => setShowModal(false)}
            onConfirm={() => setShowModal(false)}
          />
        </div>
      </header>
      <ResponsiveTable headers={headers} rows={rows} />
      <ContinueCheckoutModal
        isOpen={isLastModal}
        onClose={() => setIsLastModal(false)}
        onConfirm={() => setIsLastModal(false)}
        handleDeleteVehicle={() => handleDelete(vehicleid, status)}
        isDeleteVehicle={true}
      />
    </section>
  );
}
