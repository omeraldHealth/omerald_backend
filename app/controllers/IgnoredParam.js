const IgnoredParams = require('../models/ignoredParam');

// Get all ignoredParams
const getIgnoredParams = async (req, res) => {
  try {
    const ignoredParams = await IgnoredParams.find();
    res.json(ignoredParams);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create a new ignoredParams
const createIgnoredParams = async (req, res) => {

  const { name,value,unit,range,category } = req.body;
  try {
    const ignoredParams = await IgnoredParams.create({ name,value,unit,range,category });
    res.status(201).json(ignoredParams);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' + error });
  }
};

const createManyignoredParams = async (req, res) => {
    try {
      const ignoredParams = await IgnoredParams.create(req.body);
      res.status(201).json(ignoredParams);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' + error });
    }
  };

// Update a ignoredParams by ID
const updateignoredParams = async (req, res) => {
    const { id,name } = req.body;
  try {
    const ignoredParams = await IgnoredParams.findByIdAndUpdate(id, { name }, { new: true });
    if (!ignoredParams) {
      return res.status(404).json({ error: 'ignoredParams not found' });
    }
    res.json(ignoredParams);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete a ignoredParams by ID
const deleteignoredParams = async (req, res) => {
  const { id } = req.params;
  try {
    const ignoredParams = await IgnoredParams.findByIdAndDelete(id);
    if (!ignoredParams) {
      return res.status(404).json({ error: 'ignoredParams not found' });
    }
    res.json({ message: 'ignoredParams deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
    getIgnoredParams,
  createIgnoredParams,
  createManyignoredParams,
  updateignoredParams,
  deleteignoredParams,
};
