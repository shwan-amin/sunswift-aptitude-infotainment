import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { formatNumber, formatTime } from "../helpers/formaters"

export default function Chart({ telemetry, field, title }) {
  return (
    <div className="chart">
      <h2>{title}</h2>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={telemetry} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
          <CartesianGrid stroke="var(--chart-grid)" vertical={false} />
          <XAxis
            dataKey="timestamp"
            tickFormatter={formatTime}
            stroke="var(--chart-axis)"
            tickLine={false}
          />
          <YAxis
            stroke="var(--chart-axis)"
            tickLine={false}
            axisLine={false}
            width={48}
          />
          <Tooltip
            labelFormatter={formatTime}
            formatter={(value) => formatNumber(value)}
          />
          <Line
            type="monotone"
            dataKey={field}
            name={title}
            stroke="var(--chart-series)"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}