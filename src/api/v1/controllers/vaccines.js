const VaccinesModel = require('../models/vaccine');

// Get all Vaccine
const getVaccine = async (req, res) => {
  try {
    const vaccine = await VaccinesModel.find();
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

const createManyVaccine = async (req, res) => {
    try {
      const vaccine = await VaccinesModel.create(req.body);
      res.status(201).json(vaccine);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' + error });
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

// Delete a Vaccine by ID
const deleteVaccine = async (req, res) => {
  const { id } = req.params;
  try {
    const vaccine = await VaccinesModel.findByIdAndDelete(id);
    if (!vaccine) {
      return res.status(404).json({ error: 'Vaccine not found' });
    }
    res.json({ message: 'vaccine deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getVaccine,
  createVaccine,
  createManyVaccine,
  updateVaccine,
  deleteVaccine,
};
