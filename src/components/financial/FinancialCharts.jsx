import { useContext, useEffect, useState } from "react";
import {
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import axios from "axios";
import { ManagerContext } from "../../context/ManagerContext";

const FinancialCharts = () => {
  const { BASE_URL } = useContext(ManagerContext);
  const url = `${BASE_URL}`;
  const [revenuePerYearData, setRevenuePerYearData] = useState([]);
  const [bookingsPerYearData, setBookingsPerYearData] = useState([]);
  const [costPerYearData, setCostPerYearData] = useState([]);

  const getRevenuePerYear = async () => {
    try {
      const response = await axios.get(`${url}/bookings/RevenuePerYear`);

      if (response.status === 200) {
        if (response.data !== false) {
          setRevenuePerYearData(response.data);
        }
      }
    } catch (error) {
      console.error("Error fetching revenue per year:", error);
    }
  };

  const colors = {
    2024: "#22c55e",
    2025: "#3b82f6",
  };

  const getBookingsPerYear = async () => {
    try {
      const response = await axios.get(`${url}/bookings/BookingsPerYear`);

      if (response.status === 200) {
        if (response.data !== false) {
          setBookingsPerYearData(response.data);
        }
      }
    } catch (error) {
      console.error("Error fetching total bookings per year:", error);
    }
  };

  const getCostPerYear = async () => {
    try {
      const response = await axios.get(`${url}/bookings/CostPerYear`);

      if (response.status === 200) {
        if (response.data !== false) {
          setCostPerYearData(response.data);
        }
      }
    } catch (error) {
      console.error("Error fetching total bookings per year:", error);
    }
  };

  useEffect(() => {
    getRevenuePerYear();
    getBookingsPerYear();
    getCostPerYear();
  }, []);

  return (
    <div style={{ display: "flex", gap: 40 }}>
      <div style={{ flex: 1, height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={revenuePerYearData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="year" />
            <YAxis tickFormatter={(revenue) => `R${revenue / 1000}k`} />
            <Tooltip formatter={(revenue) => `R${revenue.toLocaleString()}`} />
            <Legend />
            <Bar dataKey="revenue" name="Revenue" barSize={60}>
              {revenuePerYearData.map((entry) => (
                <Cell key={entry.year} fill={colors[entry.year]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ flex: 1, height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={bookingsPerYearData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="year" />
            <YAxis tickFormatter={(value) => `${value / 1000}k`} />
            <Tooltip formatter={(value) => `${value.toLocaleString()}`} />
            <Legend />
            <Bar dataKey="value" name="Bookings" barSize={60}>
              {bookingsPerYearData.map((entry) => (
                <Cell key={entry.year} fill={colors[entry.year]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ flex: 1, height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={costPerYearData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="year" />
            <YAxis tickFormatter={(cost) => `R${cost / 1000}k`} />
            <Tooltip formatter={(cost) => `R${cost.toLocaleString()}`} />
            <Legend />
            <Bar dataKey="cost" name="Cost" barSize={60}>
              {costPerYearData.map((entry) => (
                <Cell key={entry.year} fill={colors[entry.year]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default FinancialCharts;
