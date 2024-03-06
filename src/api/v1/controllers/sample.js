const SampleModel = require('../models/sample');

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

const createManysample = async (req, res) => {
    try {
      const sample = await SampleModel.create(req.body);
      res.status(201).json(sample);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' + error });
    }
  };

// Update a sample by ID
const updateSample = async (req, res) => {
  const { id } = req.body;
  try {
    const sample = await SampleModel.findByIdAndUpdate(id,req.body, { new: true });
    if (!sample) {
      return res.status(404).json({ error: 'sample not found' });
    }
    res.json(sample);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete a sample by ID
const deleteSample = async (req, res) => {
  const { id } = req.params;
  try {
    const sample = await SampleModel.findByIdAndDelete(id);
    if (!sample) {
      return res.status(404).json({ error: 'sample not found' });
    }
    res.json({ message: 'sample deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getSample,
  createSample,
  createManysample,
  updateSample,
  deleteSample
};
