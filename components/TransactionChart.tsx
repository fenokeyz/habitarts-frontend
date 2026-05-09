"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

export default function TransactionChart({ data }: any) {
  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />

          <XAxis
            dataKey="timestamp"
            tickFormatter={(value) => {
              const date = new Date(value);
              return date.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });
            }}
            tick={{ fontSize: 12 }}
            stroke="#9ca3af"
          />

          <YAxis
            tick={{ fontSize: 12 }}
            stroke="#9ca3af"
          />

          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const point = payload[0].payload;
                const date = new Date(point.timestamp);

                return (
                  <div className="bg-white p-3 rounded-xl shadow-lg border">
                    <p className="text-pink-500 font-bold">
                      {date.toLocaleDateString()} {" "}
                      {date.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <p className="text-black">
                      Balance: {point.balance} coins
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />

          <Legend />

          <Line
            type="monotone"
            dataKey="balance"
            name="Balance"
            stroke="#ec4899"
            strokeWidth={3}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}