import { Link } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { ManagerContext } from "../../context/ManagerContext";
import ResponsiveTable from "../../components/table/ResponsiveTable";

export default function MaintenancePage() {
  const [Vehicles, setVehicles] = useState([]);
  const { notifySuccess, notifyError, BASE_URL, formatedDate } =
    useContext(ManagerContext);
  const [filteredMaintainedVehicleData, setFilteredMaintainedVehicleData] =
    useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true); // loading state

  const url = `${BASE_URL}/vehicles`;

  useEffect(() => {
    const getVehiclesInMaintenance = async () => {
      try {
        const response = await axios.get(`${url}/maintenance`);

        if (response.status === 200) {
          if (response.data !== false) {
            setVehicles(response.data);
            setFilteredMaintainedVehicleData(response.data);
          }
        }
      } catch (error) {
        console.error("Error retreiving vehicles in maintenance:", error);
      } finally {
        setLoading(false); // stop loading once fetch is complete
      }
    };

    getVehiclesInMaintenance();
  }, []);

  const handleCheckoutClick = async (vehicleid) => {
    try {
      const response = await axios.post(`${url}/maintenance/checkout`, {
        vehicleid,
      });

      if (response.status === 200) {
        if (response.data !== false) {
          notifySuccess("Vehicle checked out of maintenance");
        }
      } else {
        notifyError("Checking vehicle out of maintenance Failed");
      }
    } catch (error) {
      console.error("Checkout error:", error.message);
      notifyError(
        "Something went wrong while checking the vehicle out of maintenance"
      );
    }
  };

  const headers = [
    "Vehicle ID",
    "Booking ID",
    "Make",
    "Model",
    "In maintenance",
    "IsActive",
    "Year",
    "Damage",
    "Charge",
    "Report date",
    "Actions",
  ];

  const rows = filteredMaintainedVehicleData.map((vehicle) => ({
    "Vehicle ID": vehicle.vehicleid,
    "Booking ID": vehicle.bookingid,
    Make: vehicle.make,
    Model: vehicle.model,
    "In maintenance": vehicle.isinmaintenance ? (
      <span className="label-red">TRUE</span>
    ) : (
      <span className="label">FALSE</span>
    ),
    IsActive: vehicle.isactive ? (
      <span className="label">TRUE</span>
    ) : (
      <span className="label-red">FALSE</span>
    ),
    Year: vehicle.year,
    Damage: vehicle.damages,
    // "Additional Note": vehicle.additionalnotes,
    Charge: vehicle.total_charge,
    "Report date": formatedDate(vehicle.reportdate),
    Actions: (
      <button
        className="btn delete-btn"
        onClick={() => handleCheckoutClick(vehicle.vehicleid)}
      >
        Checkout
      </button>
    ),
  }));

  useEffect(() => {
    const filteredRows = Vehicles.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    setFilteredMaintainedVehicleData(filteredRows);
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
        <h2 className="vehicle-table-header-title">Vehicles in maintenance</h2>
        <div className="vehicle-table-header-actions">
          <input
            type="text"
            placeholder="Search here"
            className="search"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>
      <ResponsiveTable headers={headers} rows={rows} />
    </section>
  );
}
