const SampleModel = require('../models/sample');
const xlsx = require('xlsx');

// Get all samples
const getSample = async (req, res) => {
  try {
    const samples = await SampleModel.find({ deletedAt: null });
    res.json(samples);
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create a new sample
const createSample = async (req, res) => {
  const { name, description, imageUrl, validity } = req.body;
  try {
    const sample = await SampleModel.create({ name, description, imageUrl, validity });
    res.status(201).json(sample);
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create multiple samples from uploaded file
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
    const existingSamples = await SampleModel.find().select('name -_id');
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
      const insertedSamples = [];
      for (let i = 0; i < samplesToInsert.length; i += 50) {
        const batch = samplesToInsert.slice(i, i + 50);
        const insertedBatch = await SampleModel.insertMany(batch);
        insertedSamples.push(...insertedBatch);
      }
      const insertedIds = insertedSamples.map(sample => sample._id);
      res.status(200).json({ message: "Samples inserted successfully", count: insertedIds.length, insertedIds });
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
    const sample = await SampleModel.findByIdAndUpdate(id, req.body, { new: true });
    if (!sample) {
      return res.status(404).json({ error: 'Sample not found' });
    }
    res.json(sample);
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete a sample by ID
const deleteSample = async (req, res) => {
  const { id } = req.params;
  try {
    // Fetch the sample by ID
    const sample = await SampleModel.findById(id);
    
    // If the sample is not found, send an appropriate response
    if (!sample) {
      return res.status(404).json({ message: 'Sample not found' });
    }

    // Append current timestamp to the sample name
    const timestamp = Date.now();
    const updatedName = `${sample.name}_${timestamp}`;

    // Update the sample name and set deletedAt
    await SampleModel.updateOne({ _id: id }, {
      $set: {
        name: updatedName,
        deletedAt: new Date()
      }
    });

    res.json({ message: 'Sample deleted successfully' });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get samples by array of IDs
const getSamplesByIds = async (req, res) => {
  try {
    const { ids } = req.body; // Assuming IDs are passed in the request body as an array

    if (!Array.isArray(ids)) {
      return res.status(400).json({ error: 'Invalid input. IDs must be provided as an array.' });
    }

    const samples = await SampleModel.find({ _id: { $in: ids }, deletedAt: null });
    res.json(samples);
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getSample,
  createSample,
  createManySamples,
  updateSample,
  deleteSample,
  getSamplesByIds
};
