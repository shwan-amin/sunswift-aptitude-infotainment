export default function Readout({ label, value, unit, alert = false }) {
  return (
    <div className="readout">
      <span className="label">{label}</span>
      <span className={alert ? "value alert" : "value"}>
        {value} <span className="unit">{unit}</span>
      </span>
    </div>
  )
}