"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

export default function StatsChart({ data }: { data: any[] }) {
  return (
    <div className="w-full h-[320px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="new_readers" stroke="#8884d8" name="New Readers" />
          <Line type="monotone" dataKey="cumulative_readers" stroke="#0070f3" name="Total Readers" />
          <Line type="monotone" dataKey="returning_readers" stroke="#82ca9d" name="Returning" />
          <Line type="monotone" dataKey="total_subscriptions" stroke="#ffc658" name="Subscriptions" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}