function processor(data) {
  let clean = cleanser(data);
  clean = interpolate(clean);
  return clean;
}

/**
 * Takes in JSON file of telemetry sample and cleans + parses the data.
 * Sets values to NULL on non-standard values.
 */
function cleanser(data) {
  const cleanData = data.map((entry) => {
    const newEntry = {}
    
    for (const [key, val] of Object.entries(entry)) {
      if (key === "gps") {
        newEntry[key] = parseGps(val);
      } else if (key === "speed") {
        newEntry[key] = clampSpeed(parser(val));
      } else {
        newEntry[key] = parser(val);
      }
    }

    return newEntry
  })

  return cleanData;
}

/**
 * Parse the gps coordinates separately as it is an object 
 */
function parseGps(val) {
  if (val === null || val === undefined) return null;
  const lat = parser(val.lat);
  const lng = parser(val.lng);
  if (lat === null || lng === null) return null;
  return { lat, lng };
}

/**
 * For impossibly high speeds (specifically over 100km/h) clamp it.
 */
function clampSpeed(speed) {
  if (speed === null) return null;
  return Math.min(speed, 100);
}

/**
 * Given a telemetry sample val, it will parse it accordingly (due to
 * possible corrupted strings).
 */
function parser(val) {
  if (typeof val === 'number') return isNaN(val) ? null : val;
  if (typeof val === 'string') {
    const cleaned = val.replace(/[^\d.-]/g, '');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? null : parsed;
  }
  return null;
}

/**
 * Given the cleaned telemetry data, interpolate for speed, battery and 
 * motorTemp.
 * 
 * If the previous and next entry from the one that is currently null is both
 * null, we just leave it as null and display an error message on the dashboard.
 */
function interpolate(data) {
  const result = data.map(entry => ({ ...entry }));

  // Interpolate for the three fields
  for (const key of ["speed", "battery", "motorTemp"]) {
    for (let i = 0; i < result.length; i++) {
      if (result[i][key] !== null) continue; // already valid, skip

      // look backward for the last valid value
      let prevIdx = i - 1;
      while (prevIdx >= 0 && result[prevIdx][key] === null) prevIdx--;

      // look forward for the next valid value
      let nextIdx = i + 1;
      while (nextIdx < result.length && result[nextIdx][key] === null) nextIdx++;

      const prevVal = prevIdx >= 0 ? result[prevIdx][key] : null;
      const nextVal = nextIdx < result.length ? result[nextIdx][key] : null;

      if (prevVal !== null && nextVal !== null) {
        // linear interpolation, weighted by position between the two known points
        const ratio = (i - prevIdx) / (nextIdx - prevIdx);
        result[i][key] = prevVal + (nextVal - prevVal) * ratio;
      } else if (prevVal !== null) {
        result[i][key] = prevVal;
      } else if (nextVal !== null) {
        result[i][key] = nextVal;
      }
    }
  }

  return result;
}

export {processor};

