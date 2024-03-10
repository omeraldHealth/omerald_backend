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

  if (worksheetName === "vaccines") { // Ensure the correct worksheet name is used
    // Fetch existing vaccine names to avoid duplicates
    const existingVaccines = await VaccinesModel.find({deletedAt:null}).select('name -_id');
    const existingNames = new Set(existingVaccines.map(vaccine => vaccine.name));

    // Validate and filter out existing names
    const validatedData = jsonData.filter(vaccine => {
      // Simple field validation
      const isValidName = typeof vaccine.name === 'string' && vaccine.name.trim() !== '';
      return isValidName && !existingNames.has(vaccine.name);
    });

    if (validatedData.length === 0) {
      return res.status(400).json({ message: "Vaccines already present or found no entries" });
    }

    // Process in batches of 50 to keep the operation performant
    for (let i = 0; i < validatedData.length; i += 50) {
      const batch = validatedData.slice(i, i + 50);
      await VaccinesModel.insertMany(batch); // Inserts each chunk sequentially
    }

    res.status(200).json({ message: "Vaccines added successfully", count: validatedData.length });
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
