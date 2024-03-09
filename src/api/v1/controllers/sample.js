const SamplesModel = require('../models/sample');
const SampleModel = require('../models/sample');
const xlsx = require('xlsx');

// Get all sample
const getSample = async (req, res) => {
  try {
    const sample = await SampleModel.find();
    res.json(sample);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create a new sample
const createSample = async (req, res) => {
  const { name ,description,imageUrl} = req.body;
  try {
    const sample = await SampleModel.create({name,description,imageUrl});
    res.status(201).json(sample);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' + error });
  }
};

const createManySamples = async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const workbook = xlsx.read(req.file.buffer);
  const worksheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[worksheetName];
  const jsonData = xlsx.utils.sheet_to_json(worksheet);

  if (worksheetName === "samples") {
    // Fetch existing samples to avoid duplicates
    const existingSamples = await SamplesModel.find().select('name -_id');
    const existingNames = new Set(existingSamples.map(sample => sample.name));

    // Filter and prepare data for insertion
    const samplesToInsert = jsonData.filter(sample => {
      // Validate simple fields
      if (typeof sample.name !== 'string' || !sample.name) {
        console.error('Name is required and must be a string');
        return false;
      }
      if (sample.description && typeof sample.description !== 'string') {
        console.error('Description must be a string');
        return false;
      }
      if (sample.imageUrl && typeof sample.imageUrl !== 'string') {
        console.error('ImageUrl must be a string');
        return false;
      }

      // Deduplication check
      return !existingNames.has(sample.name);
    });

    if (samplesToInsert.length > 0) {
      // Insert in batches of 50 to respect the limit
      for (let i = 0; i < samplesToInsert.length; i += 50) {
        const batch = samplesToInsert.slice(i, i + 50);
        await SamplesModel.insertMany(batch);
      }
      res.status(200).json({ message: "Samples inserted successfully", count: samplesToInsert.length });
    } else {
      res.status(400).json({ message: "Samples already present or found no entries" });
    }
  } else {
    res.status(400).send("Incorrect worksheet name. Please use 'samples'.");
  }
};

// Update a sample by ID
const updateSample = async (req, res) => {
  const { id } = req.body;
  try {
    const sample = await SamplesModel.findByIdAndUpdate(id,req.body, { new: true });
    if (!sample) {
      return res.status(404).json({ error: 'sample not found' });
    }
    res.json(sample);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete a sample by ID
// const deleteSample = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const sample = await SampleModel.findByIdAndDelete(id);
//     if (!sample) {
//       return res.status(404).json({ error: 'sample not found' });
//     }
//     res.json({ message: 'sample deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };
const deleteSample = async (req, res) => {
  const { id } = req.params;
  try {
    // Fetch the current user to get the phoneNumber
    const sample = await SampleModel.findById(id);
    
    if (!sample) {
      throw new Error('sample not found');
    }

    // Append current timestamp to phoneNumber
    const timestamp = Date.now();
    const updatedName = `${sample.name}*${timestamp}`;

    // Update phoneNumber and set deletedAt
    await User.updateOne({ _id: id }, {
      $set: {
        name: updatedName,
        deletedAt: new Date()
      }
    });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
    // Handle error appropriately
  }
};

module.exports = {
  getSample,
  createSample,
  createManySamples,
  updateSample,
  deleteSample
};
