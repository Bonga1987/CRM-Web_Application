import { Link } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { ManagerContext } from "../../context/ManagerContext";
import ResponsiveTable from "../../components/table/ResponsiveTable";

export default function DamageReportPage() {
  const [damageReports, setDamageReports] = useState([]);
  const { notifySuccess, notifyError, BASE_URL, formatedDate } =
    useContext(ManagerContext);
  const [filteredDamageReportData, setFilteredDamageReportData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true); // loading state

  const url = `${BASE_URL}/vehicles`;

  useEffect(() => {
    const getDamageReports = async () => {
      try {
        const response = await axios.get(`${url}/DamageReport`);

        if (response.status === 200) {
          if (response.data !== false) {
            setDamageReports(response.data);
            setFilteredDamageReportData(response.data);
          }
        }
      } catch (error) {
        console.error("Error retreiving damage reports:", error);
      } finally {
        setLoading(false); // stop loading once fetch is complete
      }
    };

    getDamageReports();
  }, []);

  const headers = [
    "Damage Report ID",
    "Vehicle ID",
    "Booking ID",
    "Make",
    "Model",
    "Year",
    "Damage",
    "Charge",
    "Report date",
  ];

  const rows = filteredDamageReportData.map((report) => ({
    "Vehicle ID": report.vehicleid,
    "Booking ID": report.bookingid,
    "Damage Report ID": report.damageid,
    Make: report.make,
    Model: report.model,
    Year: report.year,
    Damage: report.damages,
    // "Additional Note": vehicle.additionalnotes,
    Charge: report.total_charge,
    "Report date": formatedDate(report.reportdate),
  }));

  useEffect(() => {
    const filteredRows = damageReports.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    setFilteredDamageReportData(filteredRows);
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
        <h2 className="vehicle-table-header-title">Damage Reports</h2>
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
