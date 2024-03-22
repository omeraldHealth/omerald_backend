const VaccinesModel = require('../models/vaccine');
const xlsx = require('xlsx');

// Get all vaccines
const getVaccine = async (req, res) => {
  try {
    const vaccines = await VaccinesModel.find({ deletedAt: null });
    res.json(vaccines);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error: ' + error.message });
  }
};

// Create a new vaccine
const createVaccine = async (req, res) => {
  const { name } = req.body;
  try {
    if (!name || typeof name !== 'string' || name.trim() === '') {
      res.status(500).json("Invalid Name");
    }

    const vaccine = await VaccinesModel.create({ name: name.trim() });
    res.status(201).json(vaccine);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error: ' + error.message });
  }
};

// Create multiple vaccines from an Excel file
const createManyVaccines = async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const workbook = xlsx.read(req.file.buffer);
  const worksheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[worksheetName];
  const jsonData = xlsx.utils.sheet_to_json(worksheet);

  if (worksheetName !== 'vaccines') {
    return res.status(400).send("Incorrect worksheet name. Please use 'vaccines'.");
  }

  try {
    const existingVaccines = await VaccinesModel.find({ deletedAt: null }).select('name');
    const existingNames = new Set(existingVaccines.map(vaccine => vaccine.name.trim())); // Trim names just in case
  
    // Filter out vaccines that do not meet the basic criteria or already exist
    let validatedData = jsonData.filter(vaccine => {
      const isNameValid = typeof vaccine.name === 'string' && vaccine.name.trim() !== '';
      const isNameNew = !existingNames.has(vaccine.name.trim());
      return isNameValid && isNameNew; // Return true for items that are valid and new
    });
  
    if (validatedData.length === 0) {
      return res.status(400).json({ message: "No new vaccines were added. They may already be present or the file was empty." });
    }
  
    // Attempt to insert new, validated vaccines
    const insertedVaccines = await VaccinesModel.insertMany(validatedData, { ordered: false });
    res.status(200).json({ message: "Vaccines added successfully", count: insertedVaccines.length, insertedIds: insertedVaccines.map(vaccine => vaccine._id) });
  } catch (error) {
    // Handle specific error types here as needed (e.g., duplicate key error)
    if (error.name === 'BulkWriteError' && error.code === 11000) {
      return res.status(400).json({ error: 'Some vaccines could not be added due to duplication.' });
    }
    res.status(500).json({ error: 'Internal server error: ' + error.message });
  }
};

// Update a vaccine by ID
const updateVaccine = async (req, res) => {
  const { id, name } = req.body;
  try {
    const vaccine = await VaccinesModel.findByIdAndUpdate(id, { name }, { new: true });
    if (!vaccine) {
      return res.status(404).json({ error: 'Vaccine not found' });
    }
    res.json(vaccine);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error: ' + error.message });
  }
};

// Delete a vaccine by ID
const deleteVaccine = async (req, res) => {
  const { id } = req.params;
  try {
    const vaccine = await VaccinesModel.findById(id);
    if (!vaccine) {
      throw new DatabaseError('Vaccine not found');
    }
    const timestamp = Date.now();
    const updatedName = `${vaccine.name}*${timestamp}`;
    await VaccinesModel.updateOne({ _id: id }, {
      $set: {
        name: updatedName,
        deletedAt: new Date()
      }
    });
    res.json({ message: 'Vaccine deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error: ' + error.message });
  }
};

// Get vaccines by IDs
const getVaccinesByIds = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'Invalid input. IDs must be provided as a non-empty array.' });
    }
    const vaccines = await VaccinesModel.find({ _id: { $in: ids }, deletedAt: null });
    if (!vaccines || vaccines.length === 0) {
      return res.status(404).json({ message: 'No vaccines found with the provided IDs.' });
    }
    res.status(200).json(vaccines);
  } catch (error) {
    console.error('Error fetching vaccines:', error);
    res.status(500).json({ error: 'Internal server error: ' + error.message });
  }
};

module.exports = {
  getVaccine,
  createVaccine,
  createManyVaccines,
  updateVaccine,
  deleteVaccine,
  getVaccinesByIds
};
