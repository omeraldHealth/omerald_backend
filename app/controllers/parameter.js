const ParametersModel = require('../models/parameter');

// Get all parameter
const getParameter = async (req, res) => {
  try {
    const parameter = await ParametersModel.find();
    res.json(parameter);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create a new parameter
const createParameter = async (req, res) => {
  const { name,description,aliases,units,bioRefRange,isActive } = req.body;
  try {
    const parameter = await ParametersModel.create({ name,description,aliases,units,bioRefRange,isActive});
    res.status(201).json(parameter);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' + error });
  }
};

const createManyParameter = async (req, res) => {
    try {
      const parameter = await ParametersModel.create(req.body);
      res.status(201).json(parameter);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' + error });
    }
  };

// Update a parameter by ID
const updateParameter = async (req, res) => {
  const { id } = req.body;
  delete req.body.id;
  try {
    const parameter = await ParametersModel.findByIdAndUpdate(id, req.body, { new: true });
    if (!parameter) {
      return res.status(404).json({ error: 'parameter not found' });
    }
    res.json(parameter);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete a parameter by ID
const deleteparameter = async (req, res) => {
  const { id } = req.params;
  try {
    const parameter = await ParametersModel.findByIdAndDelete(id);
    if (!parameter) {
      return res.status(404).json({ error: 'parameter not found' });
    }
    res.json({ message: 'parameter deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const searchParameter = async (req, res) => {
    const { query = '', page = 1 } = req.params;
    const pageSize = 20;
    const skip = (page - 1) * pageSize;
    try {
        const results = await ParametersModel.find({
            name: { $regex: query, $options: 'i' }
          })
            .skip(skip)
            .limit(pageSize)
            .exec();

            const totalResults = await ParametersModel.countDocuments({
                title: { $regex: query, $options: 'i' },
                isActive: true,
              });

              res.status(200).json({
                results,
                totalResults,
                page,
                totalPages: Math.ceil(totalResults / pageSize),
              });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  

module.exports = {
  getParameter,
  createManyParameter,
  createParameter,
  searchParameter,
  updateParameter,
  deleteparameter,
};
