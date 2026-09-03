import Readout from "./Readout";
import {formatNumber, formatGps} from "../helpers/formaters.js"

const MOTOR_TEMP_LIMIT = 90;

export default function Display({ current }) {
  if (!current) return <p>No telemetry available</p>;

  const tooHot = current.motorTemp !== null && current.motorTemp > MOTOR_TEMP_LIMIT;

  return (
    <div className="dashboard">
      <div className="readouts">
        <Readout label="SPEED" value={formatNumber(current.speed)} unit="km/h" />
        <Readout label="BATTERY" value={formatNumber(current.battery)} unit="%" />
        <Readout
          label="MOTOR TEMP"
          value={formatNumber(current.motorTemp)}
          unit="°C"
          alert={tooHot}
        />
      </div>

      <div className="location">
        <span className="label">LOCATION</span>
        <span className="value">{formatGps(current.gps)}</span>
      </div>
    </div>
  )
}