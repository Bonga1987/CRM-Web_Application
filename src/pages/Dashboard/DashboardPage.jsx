import { useContext, useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import "./DashboardPage.css";
import axios from "axios";
import { ManagerContext } from "../../context/ManagerContext";

const COLORS = ["#4CAF50", "#2196F3", "#FFC107"];
const overdueCOLORS = ["#4caf50", "#f44336"]; // green, red
const categoryCOLORS = [
  "#9C27B0",
  "#FF9800",
  "#009688",
  "#3F51B5",
  "#E91E63",
  "#00BCD4",
  "#8BC34A",
  "#CDDC39",
  "#FF5722",
  "#673AB7",
  "#795548",
  "#607D8B",
  "#FFEB3B",
  "#9E9E9E",
  "#00E676",
  "#1DE9B6",
];

const DashboardPage = () => {
  const [availableVehicles, setAvailableVehicles] = useState([]);
  const [rentedVehicles, setRentedVehicles] = useState([]);
  const [maintainedVehicles, setMaintainedVehicles] = useState([]);
  const [fleetData, setFleetData] = useState([
    { name: "Available", value: 0 },
    { name: "Rented", value: 0 },
    { name: "Maintenance", value: 0 },
  ]);
  const [fleetDataBar, setFleetDataBar] = useState([
    { type: "", Available: 0, Rented: 0, Maintenance: 0 },
  ]);
  const [frequentCustomers, setFrequentCustomers] = useState([]);
  const [mostRentedVehicles, setMostRentedVehicles] = useState([]);
  const [popularCategories, setPopularCategories] = useState([]);
  const [overdueReturns, setOverdueReturns] = useState([
    { name: "On Time", value: 0 },
    { name: "Overdue", value: 0 },
  ]);
  const [rentalByMonths, setRentalByMonths] = useState([]);
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const [selectedYear, setSelectedYear] = useState(2025);
  const { BASE_URL } = useContext(ManagerContext);

  const url = `${BASE_URL}`;

  const getAvailableVehicles = async () => {
    try {
      const response = await axios.get(`${url}/vehicles/countActiveVehicles`);

      if (response.status === 200) {
        if (response.data !== false) {
          setAvailableVehicles(response.data); // store the vehicles in state
        }
      }
    } catch (error) {
      console.error("Error fetching available vehicles:", error);
    }
  };

  const getMaintainedVehicles = async () => {
    try {
      const response = await axios.get(
        `${url}/vehicles/countMaintainedVehicles`
      );

      if (response.status === 200) {
        if (response.data !== false) {
          setMaintainedVehicles(response.data); // store the vehicles in state
        }
      }
    } catch (error) {
      console.error("Error fetching vehicles in maintenance:", error);
    }
  };

  const getRentedVehicles = async () => {
    try {
      const response = await axios.get(`${url}/vehicles/countRentedVehicles`);

      if (response.status === 200) {
        if (response.data !== false) {
          setRentedVehicles(response.data); // store the vehicles in state
        }
      }
    } catch (error) {
      console.error("Error fetching rented vehicles:", error);
    }
  };

  const getFrequentCustomers = async () => {
    try {
      const response = await axios.get(`${url}/users/frequentCustomers`);

      if (response.status === 200) {
        if (response.data !== false) {
          setFrequentCustomers(response.data);
        }
      }
    } catch (error) {
      console.error("Error fetching frequent customers:", error);
    }
  };

  const getMostRentedVehicles = async () => {
    try {
      const response = await axios.get(`${url}/vehicles/mostRented`);

      if (response.status === 200) {
        if (response.data !== false) {
          setMostRentedVehicles(response.data);
        }
      }
    } catch (error) {
      console.error("Error fetching most rented vehicles:", error);
    }
  };

  const getPopularCategories = async () => {
    try {
      const response = await axios.get(`${url}/vehicles/popularCategories`);

      if (response.status === 200) {
        if (response.data !== false) {
          const updatedData = response.data.map((item) => ({
            ...item,
            value: parseInt(item.value),
          }));

          setPopularCategories(updatedData);
        }
      }
    } catch (error) {
      console.error("Error fetching popular categories:", error);
    }
  };

  const getOverdueReturns = async () => {
    try {
      const response = await axios.get(`${url}/bookings/overdueReturns`);

      if (response.status === 200) {
        if (response.data !== false) {
          // Count overdue vs on-time
          const overdueCount = response.data.filter(
            (b) => b.return_status === "Overdue"
          ).length;
          const onTimeCount = response.data.filter(
            (b) => b.return_status === "On Time"
          ).length;

          setOverdueReturns((prev) => {
            const updated = [...prev]; // copy array
            updated[0] = { ...updated[0], value: onTimeCount }; // change first object’s value
            return updated;
          });
          setOverdueReturns((prev) => {
            const updated = [...prev]; // copy array
            updated[1] = { ...updated[1], value: overdueCount }; // change first object’s value
            return updated;
          });
        }
      }
    } catch (error) {
      console.error("Error fetching overdue returns:", error);
    }
  };

  const getRentalByMonths = async () => {
    try {
      const response = await axios.get(`${url}/bookings/rentalByMonths`);

      if (response.status === 200) {
        if (response.data !== false) {
          response.data.map(async (rental) => {
            // Split the string into an array
            const [year, month] = rental.month.split("-");

            // Convert the month from "01" to "January"
            const monthName = monthNames[parseInt(month, 10) - 1];
            setRentalByMonths((prev) => [
              ...prev,
              {
                month: monthName,
                year: parseInt(year),
                rentals: parseInt(rental.rentals),
              },
            ]);
          });
        }
      }
    } catch (error) {
      console.error("Error fetching rentals by months:", error);
    }
  };

  useEffect(() => {
    const getReports = () => {
      //get rented
      getRentedVehicles();
      //get available
      getAvailableVehicles();
      //get mainained
      getMaintainedVehicles();
      //frequentcustomers
      getFrequentCustomers();
      //most rented vehicles
      getMostRentedVehicles();
      //popular categories
      getPopularCategories();
      //get overdue returns
      getOverdueReturns();
      //get rentals by month
      getRentalByMonths();
    };

    getReports();
  }, []);

  // Filter data based on the selected year
  const result = rentalByMonths.reduce((acc, curr) => {
    const yearUnique = curr.year;

    // Initialize if it doesn't exist
    if (!acc[yearUnique]) {
      acc[yearUnique] = {
        year: yearUnique,
      };
    }

    // Sum delays and count occurrences
    acc[yearUnique].year = curr.year || 2025;

    return acc;
  }, {});

  const yearsOnly = Object.values(result);

  const filteredData = rentalByMonths.filter(
    (rental) => rental.year === selectedYear
  );

  useEffect(() => {
    let totalAvailableVehicles = 0;
    availableVehicles.map((vehicle) => {
      totalAvailableVehicles += parseInt(vehicle.active_vehicles);
    });
    setFleetData((prev) => {
      const updated = [...prev]; // copy array
      updated[0] = { ...updated[0], value: totalAvailableVehicles }; // change first object’s value
      return updated;
    });
  }, [availableVehicles]);

  useEffect(() => {
    let totalRentedVehicles = 0;
    rentedVehicles.map((vehicle) => {
      totalRentedVehicles += parseInt(vehicle.rented_vehicles);
    });
    setFleetData((prev) => {
      const updated = [...prev]; // copy array
      updated[1] = { ...updated[1], value: totalRentedVehicles }; // change first object’s value
      return updated;
    });
  }, [rentedVehicles]);

  useEffect(() => {
    const setPieData = async () => {
      let totalMaintainedVehicles = 0;
      maintainedVehicles.map((vehicle) => {
        totalMaintainedVehicles += parseInt(vehicle.inmaintenance_vehicles);
      });
      setFleetData((prev) => {
        const updated = [...prev]; // copy array
        updated[2] = { ...updated[2], value: totalMaintainedVehicles }; // change first object’s value
        return updated;
      });
    };

    setPieData();
  }, [maintainedVehicles]);

  const formatCategory = (cat) => {
    cat.toUpperCase() === "SUV"
      ? "SUV"
      : cat.charAt(0).toUpperCase() + cat.slice(1);
  };

  useEffect(() => {
    const mergeArrays = (available, rented, maintenance) => {
      const allCategories = new Set([
        ...available.map((a) => a.category),
        ...rented.map((r) => r.category),
        ...maintenance.map((m) => m.category),
      ]);

      return Array.from(allCategories).map((category) => {
        const availableItem = available.find((a) => a.category === category);
        const rentedItem = rented.find((r) => r.category === category);
        const maintenanceItem = maintenance.find(
          (m) => m.category === category
        );

        return {
          type: category.charAt(0).toUpperCase() + category.slice(1),
          Available: Number(availableItem?.active_vehicles || 0),
          Rented: Number(rentedItem?.rented_vehicles || 0),
          Maintenance: Number(maintenanceItem?.inmaintenance_vehicles || 0),
        };
      });
    };

    const merged = mergeArrays(
      availableVehicles,
      rentedVehicles,
      maintainedVehicles
    );
    setFleetDataBar(merged);
  }, [availableVehicles, rentedVehicles, maintainedVehicles]);

  return (
    <div className="dashboard-container">
      {/* Fleet Reports */}
      <h2>Fleet Reports</h2>
      <div style={{ display: "flex", gap: 40 }} className="chart-container">
        <div style={{ flex: 1, height: 300 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={fleetData}
                dataKey="value"
                nameKey="name"
                outerRadius={80}
                fill="#8884d8"
              >
                {fleetData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div style={{ flex: 1, height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={fleetDataBar}>
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Available" stackId="a" fill="#4CAF50" />
              <Bar dataKey="Rented" stackId="a" fill="#2196F3" />
              <Bar dataKey="Maintenance" stackId="a" fill="#FFC107" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Customer Activity Reports */}
      <h2>Customer Activity Reports</h2>
      <div
        style={{ display: "flex", gap: 40, marginTop: 20 }}
        className="chart-container"
      >
        <div style={{ flex: 1, height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={frequentCustomers.slice(0, 5)}>
              <XAxis
                dataKey="customer"
                interval={0}
                tickFormatter={(name) => name.split(" ")[0]}
              />
              <YAxis />
              <Tooltip />
              <Bar dataKey="rentals" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ flex: 1, height: 300 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={overdueReturns}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                dataKey="value"
              >
                {overdueReturns.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={overdueCOLORS[index % overdueCOLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Usage Statistics */}
      <h2>Usage Statistics</h2>
      <div
        style={{ display: "flex", gap: 40, marginTop: 20 }}
        className="chart-container"
      >
        <div style={{ flex: 1, height: 300 }}>
          <ResponsiveContainer>
            <BarChart layout="vertical" data={mostRentedVehicles.slice(0, 5)}>
              <XAxis type="number" />
              <YAxis
                dataKey="vehicle"
                type="category"
                tickFormatter={(name) => name.split(" ")[0]}
              />
              <Tooltip />
              <Bar dataKey="totalrentals" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ flex: 1, height: 300 }}>
          {/* <h3>Popular categories</h3> */}
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={popularCategories.slice(0, 5)}
                dataKey="value"
                nameKey="name"
                outerRadius={80}
                fill="#82ca9d"
              >
                {popularCategories.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={categoryCOLORS[index % categoryCOLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Usage Statistics */}
      <h2>Rental Trends</h2>
      <div className="chart-container">
        {/* <h2 className="chart-title">Rental Trends</h2> */}
        <h3>Rental Data for {selectedYear}</h3>
        <div style={{ padding: "10px" }} className="form-container">
          <label style={{ display: "flex", alignItems: "center" }}>
            Filter:
            <select
              style={{
                border: "1px solid #ccc",
                color: "#717171ff",
                width: "60px",
              }}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
            >
              <option value={2025}>{"Filter"}</option>
              {yearsOnly.map((booking, index) => (
                <option key={index} value={booking.year}>
                  {booking.year}
                </option>
              ))}
              {/* <option value={2024}>2024</option>
                <option value={2023}>2023</option> */}
            </select>
          </label>
        </div>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={filteredData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="rentals"
              stroke="#8884d8"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardPage;
