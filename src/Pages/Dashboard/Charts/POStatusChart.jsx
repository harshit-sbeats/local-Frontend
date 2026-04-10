import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Placed", value: 720 },
  { name: "Partially Received", value: 310 },
  { name: "Completed", value: 185 },
  { name: "Cancelled", value: 43 }
];

const COLORS = ["#3b82f6", "#f59e0b", "#10b981", "#ef4444"];

export default function POStatusChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          innerRadius={70}
          outerRadius={100}
          paddingAngle={5}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={index} fill={COLORS[index]} />
          ))}
        </Pie>

        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}