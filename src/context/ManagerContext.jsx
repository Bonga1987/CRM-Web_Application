import { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

// 1. Create the Context
export const ManagerContext = createContext();

// 2. Create a Provider Component
export const ManagerProvider = ({ children }) => {
  // const BASE_URL = "https://bongacrmrental.loca.lt/api";
  const BASE_URL = "http://localhost:4000/api";
  const BASE_URL_UPLOAD = "http://localhost:4000";
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [staff, setStaff] = useState([
    {
      fullname: "",
      email: "",
      role: "",
      phone: "",
      usertype: null,
      staffid: null,
    },
  ]);
  const [isOpen, setIsOpen] = useState(false);

  const getStaff = () => {
    try {
      const value = localStorage.getItem("staff");
      if (value !== null) {
        return JSON.parse(value); // convert back to object
      }
      return null; // nothing saved
    } catch (error) {
      console.error("Error retrieving staff:", error);
      return null;
    }
  };

  const formatedDate = (date) => {
    if (!date) return "";

    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");

    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  // check login state from localstorage on app start
  useEffect(() => {
    const loadLoginState = () => {
      try {
        const stored = localStorage.getItem("isLoggedIn");
        const staff = getStaff();

        setIsLoggedIn(stored === "true");
        setStaff(staff);
      } catch (error) {
        console.error("Error loading login state:", error);
        setIsLoggedIn(false);
      }
    };

    loadLoginState();
  }, []);

  // Save to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("isLoggedIn", isLoggedIn);
  }, [isLoggedIn]);

  const notifySuccess = (msg) =>
    toast.success(msg, {
      position: "top-center",
      autoClose: 3000, // Automatically close after 3 seconds
    });

  const notifyError = (msg) =>
    toast.error(msg, {
      position: "top-center",
      autoClose: 3000, // Automatically close after 3 seconds
    });

  return (
    <ManagerContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        staff,
        setStaff,
        formatedDate,
        notifyError,
        notifySuccess,
        isOpen,
        setIsOpen,
        BASE_URL,
        BASE_URL_UPLOAD,
      }}
    >
      {children}
    </ManagerContext.Provider>
  );
};
