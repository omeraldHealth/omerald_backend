const AnalysedParams = require('../models/analysedParam');

// Get all AnalysedParams
const getAnalysedParams = async (req, res) => {
  try {
    const analysedParam = await AnalysedParams.find();
    res.json(analysedParam);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};


// Create a new AnalysedParam
const createAnalysedParam = async (req, res) => {
    const data = req.body;
    const addData = {
      name: data.name,
      value: data.description,
      unit: data.units,
      range: data.range
    };

    try {
        const analysedParam = await AnalysedParams.create(addData);
        res.status(201).json(analysedParam);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' + error });
    }
};

// Delete a AnalysedParam by ID
const createManyParam = async (req, res) => {
  try {
    const dcData = req.body;
    const AnalysedParam = await AnalysedParam.insertMany(dcData);
    if (!AnalysedParam) {
      return res.status(404).json({ error: 'AnalysedParam not found' });
    }
    res.json({ message: 'AnalysedParam deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getAnalysedParams,
  createAnalysedParam,
  updateAnalysedParam,
  createManyParam,
};
