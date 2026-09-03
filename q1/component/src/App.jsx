import { useMemo } from 'react'
import data from "../../telemetry_sample.json" with { type: "json" };
import './App.css'
import Display from './components/Display';
import History from './components/History';
import { processor } from './helpers/parsers';

/*
 * TASK APPROACH:
 * Cleanse data by attempting to parse or leave to null. If left to null an 
 * appropriate message will be displayed on the dashboard. 
 *
 * Speed, battery and motor temp is interpolated if cleansed to null. 
 * This is because these values can't drop instantly (can't go from 80km/h to 
 * 0) REALISTICALLY so we can estimate via the previous value and the next.
 * 
 * Corrupted strings should try be stripped to its normal value, but if this is
 * not possible then leave as null. E.g change "40km/h" to 40
 * 
 * High outlier speeds should be clamped.
 * 
 * GPS data should not be interpolated, so leave as NULL and display a message 
 * on the dashboard.
 * 
 */
function App() {
  const telemetry = useMemo(() => processor(data), []);

  const current = telemetry[telemetry.length - 1];

  return (
    <>
      <Display current={current} />
      <History telemetry={telemetry} />
    </>
  )
}

export default App
