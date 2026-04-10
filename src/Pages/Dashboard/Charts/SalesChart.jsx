import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend
} from "recharts";

const data = [
  { month: "Jan", sales: 3200, lastYear: 2100 },
  { month: "Feb", sales: 3400, lastYear: 2300 },
  { month: "Mar", sales: 3600, lastYear: 2500 },
  { month: "Apr", sales: 4000, lastYear: 3800 },
  { month: "May", sales: 4200, lastYear: 3000 },
  { month: "Jun", sales: 5100, lastYear: 3200 },
  { month: "Jul", sales: 4900, lastYear: 3400 },
  { month: "Aug", sales: 4700, lastYear: 3600 },
  { month: "Sep", sales: 6000, lastYear: 4100 },
  { month: "Oct", sales: 5300, lastYear: 3900 },
  { month: "Nov", sales: 5100, lastYear: 3700 },
  { month: "Dec", sales: 6200, lastYear: 3800 }
];

export default function SalesChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="sales" stroke="#3b82f6" strokeWidth={3} />
        <Line type="monotone" dataKey="lastYear" stroke="#9ca3af" />
      </LineChart>
    </ResponsiveContainer>
  );
}