const DoseDuration = require('../models/doseDuration');

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
    try {
      const doseDuration = await DoseDuration.create(req.body);
      res.status(201).json(doseDuration);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' + error });
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
const deleteDoseDuration = async (req, res) => {
  const { id } = req.body;
  try {
    const doseDuration = await DoseDuration.findByIdAndDelete(id);
    if (!doseDuration) {
      return res.status(404).json({ error: 'DoseDuration not found' });
    }
    res.json({ message: 'DoseDuration deleted successfully' });
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
};
