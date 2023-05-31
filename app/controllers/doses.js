const DosesModel = require('../models/dose');

// Get all dosess
const getAlldosess = async (req, res) => {
  try {
    const doses = await DosesModel.find();
    res.json(doses);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create a new doses
const getdosesById = async (req, res) => {
    try {
        const { id } = req.params;
        const doses = await DosesModel.findById(id);
        res.json(doses);
      } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
      }
};

// Create
const createdosess = async (req, res) => {
    try {
      const { name,duration,vaccine,type} = req.body;
      const doses = await DosesModel.create({ name,duration,vaccine,type});
      if (!doses) {
        return res.status(404).json({ error: 'doses not found' });
      }
      res.json({ message: 'doses added successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
};

// Delete a doses by ID
const createManydosess = async (req, res) => {
  try {
    const doses = await DosesModel.insertMany(req.body);
    if (!doses) {
      return res.status(404).json({ error: 'doses not found' });
    }
    res.json({ message: 'doses added successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updatedosess = async (req, res) => {
    const { id } = req.body;
    try {
      const doses = await DosesModel.findByIdAndUpdate(id,req.body, { new: true });
      if (!doses) {
        return res.status(404).json({ error: 'doses not found' });
      }
      res.json({ message: 'doses updated successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
};

const deletedoses = async (req, res) => {
    const { id } = req.params;
    try {
      const doses = await DosesModel.findByIdAndDelete(id);
      if (!doses) {
        return res.status(404).json({ error: 'doses not found' });
      }
      res.json({ message: 'doses deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
  getAlldosess,
  getdosesById,
  createdosess,
  createManydosess,
  updatedosess,
  deletedoses,
};
