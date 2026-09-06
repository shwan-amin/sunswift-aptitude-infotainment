/*
 * A small Express server that accepts batches of telemetry logs and summarises them.
 * Logs are kept in a global array called 'data'. Uploads are validated as: every entry
 * must be an object with a numeric timestamp, a numeric value and a component in the allowed
 * list, and if any one entry fails the whole batch is rejected with 400. I assumed any 
 * finite number is an acceptable timestamp and value, and that unknown extra 
 * fields on an entry are rejected rather than stored. Errors return JSON with a message: 
 * 400 for bad input or malformed JSON, 404 for unknown
 * routes, and 500 from a final handler for anything unexpected.
 */

import express from 'express';

const PORT = 8000;
const components = ['battery', 'motor', 'gps'];
const data = [];

const app = express();
app.use(express.json());



app.post('/logs/upload', (req, res) => {
  const body = req.body;

  /* Check if its in an array first */
  if (!Array.isArray(body)) {
    return res.status(400).json({ error: 'ERROR: Request must be an array of entries.' });
  }

  /* Check for errors in entries and return error if an entry is invalid  */
  for (const entry of body) {
    if (!validateEntry(entry)) {
      return res.status(400).json({
        error: 'ERROR: One or more entries are invalid, post rejected.'
      });
    }
  }

  /* Store the valid entries into data */
  for (const entry of body) {
    data.push({
      timestamp: entry.timestamp,
      component: entry.component,
      value: entry.value,
    });
  }

  return res.status(201).json({ message: "SUCCESS: Given entries have been validated and stored to data." });
});

/**
 * For a given entry, it will check if it is a valid JS object, has the correct
 * fields and the correct types for each field.
 * 
 * @returns {boolean}
 */
function validateEntry(entry) {
  /* If the entry is not an object, reject it */
  if (entry === null || typeof entry !== 'object' || Array.isArray(entry)) {
    return false;
  }

  /* Check for valid timestamp field */
  if (!('timestamp' in entry)) {
    return false;
  } else if (typeof entry.timestamp !== 'number') {
    return false;
  }

  /* Check for valid component field */
  if (!('component' in entry)) {
    return false;
  } else if (!components.includes(entry.component)) {
    return false;
  }

  /* Check for valid value component field */
  if (!('value' in entry)) {
    return false;
  } else if (typeof entry.value !== 'number') {
    return false;
  }

  return true;
}

app.get('/logs/summary', (req, res) => {
  /* Return empty object if no data */
  if (data.length === 0) {
    return res.status(204).json({});
  }

  const body = fetch();

  res.status(200).json(body);
});

/* Collates all the data into a summary object */
function fetch() {
  let bCount = 0;
  let bMax = -Infinity;
  let bMin = Infinity;
  let bAvg = 0;

  let mCount = 0;
  let mMax = -Infinity;
  let mMin = Infinity;
  let mAvg = 0;

  let gCount = 0;
  let gMax = -Infinity;
  let gMin = Infinity;
  let gAvg = 0;

  data.forEach((entry) => {
    if (entry.component == "battery") {
      bCount++;
      if (entry.value > bMax) bMax = entry.value;
      if (entry.value < bMin) bMin = entry.value;
      bAvg = (bAvg + entry.value);

    } else if (entry.component == "motor") {
      mCount++;
      if (entry.value > mMax) mMax = entry.value;
      if (entry.value < mMin) mMin = entry.value;
      mAvg = (mAvg + entry.value);

    } else {
      gCount++;
      if (entry.value > gMax) gMax = entry.value;
      if (entry.value < gMin) gMin = entry.value;
      gAvg = (gAvg + entry.value);
    }
  });

  return {
    count: data.length,
    components: {
      battery: {min: bMin, max: bMax, avg: bAvg / bCount, count: bCount},
      motor: {min: mMin, max: mMax, avg: mAvg / mCount, count: mCount},
      gps: {min: gMin, max: gMax, avg: gAvg / gCount, count: gCount}
    },
    latest: data.reduce((latest, entry) => (entry.timestamp > latest.timestamp ? entry : latest))
  };
}

app.use((req, res) => {
  res.status(404).json({ error: `Cannot ${req.method} ${req.path}` });
});

app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Malformed JSON in request body' });
  }
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
