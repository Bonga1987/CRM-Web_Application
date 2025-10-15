import { useContext, useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import "./SalesComparisonChart.css";
import axios from "axios";
import { ManagerContext } from "../../context/ManagerContext";

const SalesComparisonChart = () => {
  const { BASE_URL } = useContext(ManagerContext);
  const url = `${BASE_URL}`;
  const [revenueByMonth, setRevenueByMonth] = useState([]);
  const [revenueByMonthformatted, setRevenueByMonthformatted] = useState([]);
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

  const getRevenueByMonth = async () => {
    try {
      const response = await axios.get(`${url}/bookings/RevenueByMonth`);

      if (response.status === 200) {
        if (response.data !== false) {
          setRevenueByMonth(response.data);
        }
      }
    } catch (error) {
      console.error("Error fetching revenue by months:", error);
    }
  };

  useEffect(() => {
    getRevenueByMonth();
  }, []);

  useEffect(() => {
    // Transform to { month: "JAN", thisYear: 1000, lastYear: 800 } format
    const currentYear = new Date().getFullYear();
    const lastYear = currentYear - 1;

    const formattedData = monthNames.map((month, index) => {
      const monthNum = String(index + 1).padStart(2, "0");

      const thisYearMonth = `${currentYear}-${monthNum}`;
      const lastYearMonth = `${lastYear}-${monthNum}`;

      const thisYearRevenue =
        revenueByMonth.find((revenue) => revenue.date === thisYearMonth)
          ?.revenue || 0;
      const lastYearRevenue =
        revenueByMonth.find((revenue) => revenue.date === lastYearMonth)
          ?.revenue || 0;

      return {
        month: month,
        thisYear: thisYearRevenue,
        lastYear: lastYearRevenue,
      };
    });

    setRevenueByMonthformatted(formattedData);
  }, [revenueByMonth]);

  console.log(revenueByMonthformatted);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={revenueByMonthformatted}
        margin={{ top: 10, right: 20, left: 0, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
        <YAxis tickFormatter={(revenue) => `R${revenue / 1000}k`} />
        <Tooltip formatter={(revenue) => `R${revenue.toLocaleString()}`} />
        <Legend />
        <Bar dataKey="thisYear" name="This Year" fill="#3b82f6" barSize={30} />
        <Bar dataKey="lastYear" name="Last Year" fill="#9ca3af" barSize={30} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default SalesComparisonChart;
