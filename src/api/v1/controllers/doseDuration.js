const DoseDurationsModel = require('../models/doseDuration');
const DoseDuration = require('../models/doseDuration');
const xlsx = require('xlsx');

// Get all DoseDuration
const getDoseDuration = async (req, res) => {
  try {
    const doseDuration = await DoseDuration.find();
    res.json(doseDuration);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create a new DoseDuration
const createDoseDuration = async (req, res) => {
  const { duration } = req.body;
  try {
    const doseDuration = await DoseDuration.create({duration});
    res.status(201).json(doseDuration);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' + error });
  }
};

const createManyDoseDuration = async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const workbook = xlsx.read(req.file.buffer);
  const worksheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[worksheetName];
  const jsonData = xlsx.utils.sheet_to_json(worksheet);

  if (worksheetName === "doseDurations") {
    const existingDurations = await DoseDurationsModel.find();
    // Assuming `duration` is unique by combining `type` and `value`
    const existingCombos = new Set(existingDurations.map(item => `${item.duration.type}-${item.duration.value}`));

    const validatedData = jsonData.filter(item => {
      // Validate fields
      const isValidType = typeof item.type === 'string' && item.type.trim() !== '';
      const combo = `${item.type}-${item.value}`;
      return isValidType && !existingCombos.has(combo);
    }).map(item => ({
      duration: {
        type: item.type,
        value: item.value
      }
    }));

    // Insert in batches of 50 to avoid performance issues
    const CHUNK_SIZE = 50;
    for (let i = 0; i < validatedData.length; i += CHUNK_SIZE) {
      const chunk = validatedData.slice(i, i + CHUNK_SIZE);
      await DoseDurationsModel.insertMany(chunk);
    }

    if (validatedData.length > 0) {
      res.status(200).json({ message: "Dose durations inserted successfully", count: validatedData.length });
    } else {
      res.status(400).json({ message: "No new dose durations were added. They may already be present or the file was empty or errored." });
    }
  } else {
    res.status(400).send("Incorrect worksheet name. Please use 'doseDurations'.");
  }
};

// Update a DoseDuration by ID
const updateDoseDuration = async (req, res) => {
  const { id,duration } = req.body;
  try {
    const doseDuration = await DoseDuration.findByIdAndUpdate(id, { duration }, { new: true });
    if (!doseDuration) {
      return res.status(404).json({ error: 'DoseDuration not found' });
    }
    res.json(doseDuration);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete a DoseDuration by ID
// const deleteDoseDuration = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const doseDuration = await DoseDuration.findByIdAndDelete(id);
//     if (!doseDuration) {
//       return res.status(404).json({ error: 'DoseDuration not found' });
//     }
//     res.json({ message: 'DoseDuration deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };

const deleteDoseDuration = async (req, res) => {
  const { id } = req.params;
  try {
    // Fetch the current user to get the phoneNumber
    const doseDuration = await DoseDuration.findByIdAndUpdate(id ,  {deletedAt: Date.now()});
    if (!doseDuration) {
      return res.status(404).json({ error: 'DoseDuration not found' });
    }

    res.json({ message: 'DoseDuration deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
    // Handle error appropriately
  }
};


module.exports = {
  getDoseDuration,
  createDoseDuration,
  createManyDoseDuration,
  updateDoseDuration,
  deleteDoseDuration,
};
