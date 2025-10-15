import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import ResponsiveTable from "../../components/table/ResponsiveTable";
import { ManagerContext } from "../../context/ManagerContext";

export default function InvoicePage() {
  const [invoices, setInvoices] = useState([]);
  const { BASE_URL, formatedDate } = useContext(ManagerContext);
  const url = `${BASE_URL}/bookings`;
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredInvoiceData, setFilteredInvoiceData] = useState([]);
  const [loading, setLoading] = useState(true); // loading state

  useEffect(() => {
    const getAllInvoices = async () => {
      try {
        const response = await axios.get(`${url}/invoices`);

        if (response.status === 200) {
          if (response.data !== false) {
            setInvoices(response.data); // store the vehicles in state
            setFilteredInvoiceData(response.data);
          }
        }
      } catch (error) {
        console.error("Error fetching invoices:", error);
      } finally {
        setLoading(false); // stop loading once fetch is complete
      }
    };

    getAllInvoices();
  }, []);

  const headers = [
    "Invoice ID",
    "Booking ID",
    "Customer",
    "Email",
    "Phone number",
    "Vehicle",
    "Amount",
    "Late fees",
    "Damages",
    "Generated Date",
    "Status",
  ];

  const rows = filteredInvoiceData.map((invoice) => ({
    "Invoice ID": invoice.invoiceid,
    "Booking ID": <span className="link">{invoice.bookingid}</span>,
    Customer: invoice.fullname,
    Email: invoice.email,
    "Phone number": invoice.phonenumber,
    Vehicle: `${invoice.make} ${invoice.model}`,
    Amount: invoice.amount,
    "Late fees": invoice.latefees,
    Damages: invoice.damages,
    "Generated Date": formatedDate(invoice.generateddate),
    Status:
      invoice.paymentstatus === "Unpaid" ? (
        <span className="label-red">{invoice.paymentstatus}</span>
      ) : (
        <span className="label">{invoice.paymentstatus}</span>
      ),
  }));

  useEffect(() => {
    const filteredRows = invoices.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    setFilteredInvoiceData(filteredRows);
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
        <h2 className="vehicle-table-header-title">Invoices</h2>
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
