/**
 * Fallback for any numeric field that could not be recovered by the cleaner.
 */
function formatNumber(val, decimals = 1) {
  if (val === null || val === undefined) return "XX";
  return val.toFixed(decimals);
}

/**
 * GPS is never interpolated, so a dropout is shown as a message instead.
 */
function formatGps(gps) {
  if (!gps) return "Location not found";
  return `${gps.lat.toFixed(4)}, ${gps.lng.toFixed(4)}`;
}

/**
 * Clock time for the x axis, so the charts line up with the run rather than
 * with array indexes.
 */
function formatTime(timestamp) {
  if (timestamp === null || timestamp === undefined) return "";
  return new Date(timestamp).toLocaleTimeString([], {
    minute: "2-digit",
    second: "2-digit",
  });
}

export {formatNumber, formatTime, formatGps};