const DoseDurationsModel = require('../models/doseDuration');
const xlsx = require('xlsx');

// Get all DoseDurations
const getDoseDuration = async (req, res) => {
  try {
    const doseDurations = await DoseDurationsModel.find({ deletedAt: null });
    res.json(doseDurations);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create a new DoseDuration
const createDoseDuration = async (req, res) => {
  const { duration } = req.body;
  
  try {
    // Directly pass the duration object as it matches the expected structure
    const doseDuration = await DoseDurationsModel.create({ duration });
    res.status(201).json(doseDuration);
  } catch (error) {
    console.error(error); // It's helpful to log the actual error for debugging
    res.status(500).json({ error: 'Internal server error: ' + error.message });
  }
};

// Create multiple DoseDurations from an Excel file
const createManyDoseDuration = async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const workbook = xlsx.read(req.file.buffer);
  const worksheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[worksheetName];
  const jsonData = xlsx.utils.sheet_to_json(worksheet);

  if (worksheetName === 'doseDurations') {
    try {
      const existingDurations = await DoseDurationsModel.find({}, { duration: 1 });
      const existingDurationSet = new Set(existingDurations.map(d => `${d.duration.type}-${d.duration.value}`));

      const newData = jsonData
        .filter(item => item.type && item.value)
        .filter(item => !existingDurationSet.has(`${item.type}-${item.value}`))
        .map(item => ({ duration: { type: item.type, value: item.value } }));

      if (newData.length === 0) {
        return res.status(400).json({ message: 'No new data to insert' });
      }

      const insertedData = await DoseDurationsModel.insertMany(newData);
      res.status(201).json({ message: 'Dose durations inserted successfully', insertedData });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(400).send("Incorrect worksheet name. Please use 'doseDurations'.");
  }
};

// Update a DoseDuration by ID
const updateDoseDuration = async (req, res) => {
  const { id } = req.body;
  // Ensure that `duration` in `req.body` is structured correctly
  // Example `req.body` structure: { duration: { type: "weeks", value: "2" } }
  const { duration } = req.body;

  try {
    // It's crucial to ensure that the update object matches your schema's structure
    // If `duration` is already structured as { type: String, value: String }, you can pass it directly
    const update = { duration };

    const updatedDoseDuration = await DoseDurationsModel.findByIdAndUpdate(id, update, { new: true });
    if (!updatedDoseDuration) {
      return res.status(404).json({ error: 'DoseDuration not found' });
    }
    res.json(updatedDoseDuration);
  } catch (error) {
    console.error(error); // It's useful to log the actual error for debugging
    res.status(500).json({ error: 'Internal server error: ' + error.message });
  }
};

// Delete a DoseDuration by ID
const deleteDoseDuration = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedDoseDuration = await DoseDurationsModel.findByIdAndUpdate(id, { deletedAt: Date.now() });
    if (!deletedDoseDuration) {
      return res.status(404).json({ error: 'DoseDuration not found' });
    }
    res.json({ message: 'DoseDuration deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get DoseDurations by IDs
const getDoseDurationsByIds = async (req, res) => {
  const { ids } = req.body;
  try {
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'Invalid input. IDs must be provided as a non-empty array.' });
    }
    const doseDurations = await DoseDurationsModel.find({ _id: { $in: ids }, deletedAt: null });
    res.json(doseDurations);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getDoseDuration,
  createDoseDuration,
  createManyDoseDuration,
  updateDoseDuration,
  deleteDoseDuration,
  getDoseDurationsByIds
};
