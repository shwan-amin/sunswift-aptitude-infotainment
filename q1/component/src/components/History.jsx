import Chart from "./Chart";

export default function History({ telemetry }) {
  if (!telemetry.length) return null;

  return (
    <div className="charts">
      <Chart telemetry={telemetry} field="speed" title="Speed (km/h)" />
      <Chart telemetry={telemetry} field="battery" title="Battery (%)" />
      <Chart telemetry={telemetry} field="motorTemp" title="Motor temp (°C)" />
    </div>
  )
}