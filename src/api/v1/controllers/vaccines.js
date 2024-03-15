const VaccinesModel = require('../models/vaccine');
const xlsx = require('xlsx');
// Get all Vaccine
const getVaccine = async (req, res) => {
  try {
    const vaccine = await VaccinesModel.find({deletedAt: null});
    res.json(vaccine);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create a new Vaccine
const createVaccine = async (req, res) => {
  const { name } = req.body;
  try {
    const vaccine = await VaccinesModel.create({name});
    res.status(201).json(vaccine);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' + error });
  }
};

const createManyVaccines = async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const workbook = xlsx.read(req.file.buffer);
  const worksheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[worksheetName];
  const jsonData = xlsx.utils.sheet_to_json(worksheet);

  if (worksheetName === "vaccines") {
    // Fetch existing vaccines to avoid duplicates and ensure they're not marked as deleted
    const existingVaccines = await VaccinesModel.find({ deletedAt: null }).select('name -_id');
    const existingNames = new Set(existingVaccines.map(vaccine => vaccine.name));

    // Validate and prepare data
    const validatedData = jsonData.filter(vaccine => {
      const isValidName = typeof vaccine.name === 'string' && vaccine.name.trim() !== '';
      // Perform initial filtering to remove existing names
      return isValidName && !existingNames.has(vaccine.name.trim());
    }).map(vaccine => {
      // Basic structure validation and sanitization
      return {
        name: vaccine.name.trim(),
        type: typeof vaccine.type === 'string' ? vaccine.type : undefined,
        recommendedFor: Array.isArray(vaccine.recommendedFor) ? vaccine.recommendedFor : (typeof vaccine.recommendedFor === 'string' ? vaccine.recommendedFor.split(',') : []),
        // Assume other fields are validated and sanitized accordingly
      };
    }).filter(vaccine => vaccine.name && vaccine.type); // Ensure valid entries

    if (validatedData.length === 0) {
      return res.status(400).json({ message: "No new vaccines were added. They may already be present or the file was empty." });
    }

    // Batch insert while respecting the limit of 50 entries
    const results = [];
    for (let i = 0; i < validatedData.length; i += 50) {
      const batch = validatedData.slice(i, i + 50);
      const insertResult = await VaccinesModel.insertMany(batch, { ordered: false }).catch(e => {
        // Handle the duplicate key error or other insertion errors
        return e;
      });
      results.push(insertResult);
    }

    // If there were any successful inserts, assume success
    if (results.length > 0) {
      res.status(200).json({ message: "Vaccines added successfully", count: validatedData.length });
    } else {
      // If all batches failed (highly unlikely), return a generic failure message
      res.status(400).json({ message: "Failed to add new vaccines. Please check your data and try again." });
    }
  } else {
    res.status(400).send("Incorrect worksheet name. Please use 'vaccines'.");
  }
};


// Update a Vaccine by ID
const updateVaccine = async (req, res) => {
  const { id,name } = req.body;
  try {
    const vaccine = await VaccinesModel.findByIdAndUpdate(id, { name }, { new: true });
    if (!vaccine) {
      return res.status(404).json({ error: 'vaccine not found' });
    }
    res.json(vaccine);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteVaccine = async (req, res) => {
  const { id } = req.params;
  try {
    // Fetch the current user to get the phoneNumber
    const vaccine = await VaccinesModel.findById(id);
    
    if (!vaccine) {
      throw new Error('User not found');
    }

    // Append current timestamp to phoneNumber
    const timestamp = Date.now();
    const updatedPhoneNumber = `${vaccine.name}*${timestamp}`;

    // Update phoneNumber and set deletedAt
    await VaccinesModel.updateOne({ _id: id }, {
      $set: {
        phoneNumber: updatedPhoneNumber,
        deletedAt: new Date()
      }
    });

    res.json({ message: 'Vaccine deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
    // Handle error appropriately
  }
};

module.exports = {
  getVaccine,
  createVaccine,
  createManyVaccines,
  updateVaccine,
  deleteVaccine,
};
