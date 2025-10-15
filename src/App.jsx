import { useContext, useEffect } from "react";
import Header from "./components/header/Header";
import Sidebar from "./components/sidebar/Sidebar";
import VehiclePage from "./pages/vehicle/vehicles/VehiclePage";
import LoginPage from "./pages/login/LoginPage";
import VehicleEditPage from "./pages/vehicle/edit/VehicleEditPage";
import BookingDetailsPage from "./pages/booking/details/BookingDetailsPage";
import BookingsPage from "./pages/booking/bookings/BookingPage";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import { ManagerContext } from "./context/ManagerContext";
import MaintenancePage from "./pages/maintenance/MaintenancePage";
import InvoicePage from "./pages/invoice/InvoicePage";
import { ToastContainer } from "react-toastify";
import DamageReportPage from "./pages/damageReport/DamageReportPage";

export default function App() {
  const { isLoggedIn, setIsOpen, isOpen, staff } = useContext(ManagerContext);

  return (
    <>
      {isLoggedIn ? (
        <div className="app-layout">
          <Sidebar />
          <div className="main-section">
            <Header />
            <main
              className="page-content"
              onClick={() => {
                if (isOpen) setIsOpen(false);
              }}
            >
              <Routes>
                {staff.usertype === 1 ? (
                  <Route path="/Booking" element={<BookingsPage />} />
                ) : (
                  <Route path="/" element={<DashboardPage />} />
                )}

                <Route path="/Vehicle" element={<VehiclePage />} />
                <Route path="/Booking" element={<BookingsPage />} />
                <Route
                  path="/VehicleEdit/:vehicleid"
                  element={<VehicleEditPage />}
                />
                <Route
                  path="/BookingDetails/:bookingid"
                  element={<BookingDetailsPage />}
                />
                <Route path="/Maintenance" element={<MaintenancePage />} />
                <Route path="/DamageReport" element={<DamageReportPage />} />
                <Route path="/Invoice" element={<InvoicePage />} />
              </Routes>
              <ToastContainer />
            </main>
          </div>
        </div>
      ) : (
        <>
          <LoginPage />
          <ToastContainer />
        </>
      )}
    </>
  );
}
