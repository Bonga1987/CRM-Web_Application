import { Link } from "react-router-dom";
import "./Sidebar.css";
import { ManagerContext } from "../../context/ManagerContext";
import { useContext, useState } from "react";

export default function Sidebar() {
  const { setIsLoggedIn, setStaff, staff, setIsOpen, isOpen } =
    useContext(ManagerContext);

  const handleLogout = () => {
    try {
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("staff");
      setIsLoggedIn(false);
      setStaff({});
    } catch (error) {
      console.error("Logout error:", error.message);
    }
  };

  return (
    <>
      <button className="sidebar-toggle" onClick={() => setIsOpen(!isOpen)}>
        ☰
      </button>
      <aside className={`sidebar ${isOpen ? "active" : ""}`}>
        <div>
          <h1 className="sidebar-title">CRM</h1>
          <nav className="menu">
            {staff.usertype === 0 ? (
              <>
                <Link to="/" className="menu-item">
                  Dashboard
                </Link>
                <Link to="/Vehicle" className="menu-item">
                  Vehicles
                </Link>
                <Link to="/Booking" className="menu-item">
                  Bookings
                </Link>
                <Link to="/Maintenance" className="menu-item">
                  Maintenance
                </Link>
                <Link to="/DamageReport" className="menu-item">
                  DamageReport
                </Link>
                <h2 className="menu-section">Payments</h2>
                <Link className="menu-item" to="/Invoice">
                  Transactions
                </Link>
              </>
            ) : staff.usertype === 1 ? (
              <>
                <Link to="/Booking" className="menu-item">
                  Bookings
                </Link>
                <Link to="/Maintenance" className="menu-item">
                  Maintenance
                </Link>
                <Link to="/DamageReport" className="menu-item">
                  DamageReport
                </Link>
              </>
            ) : (
              <></>
            )}
          </nav>
        </div>

        <button className="logout" onClick={handleLogout}>
          Logout
        </button>
      </aside>
    </>
  );
}
