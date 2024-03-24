const DoseModel = require('../models/dose');
const DoseDurationsModel = require('../models/doseDuration');
const VaccinesModel = require('../models/vaccine');
const xlsx = require('xlsx');

// Get all doses
const getAllDoses = async (req, res) => {
  try {
    const doses = await DoseModel.find({ deletedAt: null })
      .populate('duration', 'duration _id')
      .populate('vaccine', 'name _id')
      .exec();
    res.json(doses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get doses by ID
const getDosesById = async (req, res) => {
  const { id } = req.params;
  try {
    const doses = await DoseModel.findOne({ _id: id, deletedAt: null })
      .populate('duration', 'duration _id')
      .populate('vaccine', 'name _id')
      .exec();
    if (!doses) {
      return res.status(404).json({ error: 'Dose not found' });
    }
    res.json(doses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create a new dose
const createDoses = async (req, res) => {
  const { name, duration, vaccine, type } = req.body;
  try {
    const newDose = await DoseModel.create({ name, duration, vaccine, type });
    res.status(201).json({ message: 'Dose added successfully', dose: newDose });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create multiple doses from an Excel file
const createManyDoses = async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const workbook = xlsx.read(req.file.buffer);
  const worksheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[worksheetName];
  const jsonData = xlsx.utils.sheet_to_json(worksheet);

  if (worksheetName === 'doses') {
    try {
      const existingDoses = await DoseModel.find({}, { name: 1 });
      const existingNames = new Set(existingDoses.map(dose => dose.name));
    
      // Your existing logic to prepare dosesToInsert remains unchanged...
      const dosesToInsert = await Promise.all(jsonData.map(async dose => {
        if (typeof dose.name !== 'string' || !dose.name || existingNames.has(dose.name)) {
          return undefined; // Skip invalid or duplicate entries
        }

        let durationDoc = null, vaccineDoc = null;

      
        // Fetch vaccine document
        if (dose.vaccine) {
          // Use a regular expression with 'i' flag for case-insensitive matching
          vaccineDoc = await VaccinesModel.findOne({ name: new RegExp('^' + dose.vaccine + '$', 'i') }, 'name _id').lean();
        }
        

        return {
          name: dose.name,
          duration: durationDoc ? durationDoc._id : null,
          vaccine: vaccineDoc ? vaccineDoc._id : null,
          type: dose.type
        };
      }));
      
      // Filter out undefined entries
      const filteredDoses = dosesToInsert.filter(dose => dose !== undefined);
    
      const CHUNK_SIZE = 50; // Adjust this size as needed
      let insertedDoses = [];
    
      for (let i = 0; i < filteredDoses.length; i += CHUNK_SIZE) {
        const chunk = filteredDoses.slice(i, i + CHUNK_SIZE);
        const insertedChunk = await DoseModel.insertMany(chunk, { ordered: false }).catch(error => {
          console.error("Error inserting chunk:", error);
          return []; // Return an empty array in case of error to keep the flow
        });
        insertedDoses.push(...insertedChunk);
      }
    
      // Extract inserted IDs from insertedDoses
      const insertedIds = insertedDoses.map(dose => dose._id);
    
      if (insertedIds.length > 0) {
        res.status(201).json({ message: 'Doses added successfully', count: insertedIds.length, insertedIds });
      } else {
        res.status(400).json({ message: 'No new doses added or duplicates found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
    
  } else {
    res.status(400).send("Incorrect worksheet name. Please use 'doses'.");
  }
};

// Update a dose by ID
const updateDoses = async (req, res) => {
  const { id } = req.body;
  try {
    const updatedDose = await DoseModel.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedDose) {
      return res.status(404).json({ error: 'Dose not found' });
    }
    res.json({ message: 'Dose updated successfully', dose: updatedDose });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete a dose by ID
const deleteDoses = async (req, res) => {
  const { id, name } = req.params;
  try {
    const timestamp = Date.now();
    const updatedName = `${name}_deleted_${timestamp}`;
    const deletedDose = await DoseModel.findByIdAndUpdate(id, { deletedAt: Date.now(), name: updatedName });
    if (!deletedDose) {
      return res.status(404).json({ error: 'Dose not found' });
    }
    res.json({ message: 'Dose deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get doses by IDs
const getDosesByIds = async (req, res) => {
  const { ids } = req.body;
  try {
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'Invalid input. IDs must be provided as a non-empty array.' });
    }
    const doses = await DoseModel.find({ _id: { $in: ids }, deletedAt: null })
      .populate('duration', 'duration _id')
      .populate('vaccine', 'name _id')
      .exec();
    res.json(doses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getAllDoses,
  getDosesById,
  createDoses,
  createManyDoses,
  updateDoses,
  deleteDoses,
  getDosesByIds
};
