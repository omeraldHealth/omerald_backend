const ParametersModel = require('../models/parameter');
const xlsx = require('xlsx');

// Function to validate if a value is a valid number
const isValidNumber = (value) => !isNaN(value) && Number.isFinite(value);

// Function to validate if a unit is a non-empty string
const isValidUnit = (unit) => typeof unit === 'string' && unit.trim() !== '';

// Function to parse and validate a basicRange string
const parseAndValidateRange = (rangeStr) => {
  const match = rangeStr.match(/min=(\d+)\smax=(\d+)\sunit=([\w/]+)/);

  if (!match) {
    console.error('Invalid basicRange format', rangeStr);
    return null;
  }
  
  const [, minStr, maxStr, unitStr] = match;
  const min = Number(minStr);
  const max = Number(maxStr);
  const unit = unitStr.trim();

  if (!isValidNumber(min) || !isValidNumber(max) || !isValidUnit(unit)) {
    console.error('Invalid basicRange values', rangeStr);
    return null;
  }

  return { min, max, unit };
};

// Get all parameters
const getParameter = async (req, res) => {
  try {
    const parameter = await ParametersModel.find({ deletedAt: null });
    res.json(parameter);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create a new parameter
const createParameter = async (req, res) => {
  const { name, description, aliases, units, bioRefRange, isActive, remedy } = req.body;
  try {
    const parameter = await ParametersModel.create({ name, description, aliases, units, bioRefRange, isActive, remedy });
    res.status(201).json(parameter);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create multiple parameters from uploaded file
const createManyParameters = async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const workbook = xlsx.read(req.file.buffer);
  const worksheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[worksheetName];
  const jsonData = xlsx.utils.sheet_to_json(worksheet);

  if (worksheetName === "parameters") {
    try {
      // Fetch existing parameter names to avoid duplicates
      const existingParameters = await ParametersModel.find().select('name -_id');
      const existingNames = new Set(existingParameters.map(param => param.name));

      const validatedData = jsonData
        .filter(param => !existingNames.has(param.name)) // Filter out existing names
        .map(param => {
          // Parse and validate bioRefRange
          const basicRanges = [];
          for (const key in param) {
            if (key.startsWith('basicRange') && typeof param[key] === 'string') {
              const rangeObj = parseAndValidateRange(param[key]);
              if (rangeObj) basicRanges.push(rangeObj);
            }
          }

          return {
            name: param.name || null,
            description: param.description || '',
            aliases: Array.isArray(param.aliases) ? param.aliases : (typeof param.aliases === 'string' ? param.aliases.split(',') : []),
            units: param.units || '',
            bioRefRange: { basicRange: basicRanges },
            isActive: param.isActive || true,
            remedy: param.remedy || '',
          };
        })
        .filter(param => param.name !== null); // Remove invalid entries

      // Batch insert validated data
      const insertedDocuments = await ParametersModel.insertMany(validatedData);
      const insertedIds = insertedDocuments.map(doc => doc._id);
      res.status(200).json({ message: "Parameters inserted successfully", count: insertedIds.length, insertedIds });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(400).send("Incorrect worksheet name. Please use 'parameters'.");
  }
};

// Update a parameter by ID
const updateParameter = async (req, res) => {
  const { id } = req.body;
  delete req.body.id; // Remove id field from the update data
  try {
    const parameter = await ParametersModel.findByIdAndUpdate(id, req.body, { new: true });
    if (!parameter) {
      return res.status(404).json({ error: 'Parameter not found' });
    }
    res.json(parameter);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete a parameter by ID
const deleteParameter = async (req, res) => {
  const { id } = req.params;
  try {
    const parameter = await ParametersModel.findById(id);
    if (!parameter) {
      return res.status(404).json({ error: 'Parameter not found' });
    }
    const timestamp = Date.now();
    const updatedName = `${parameter.name}*${timestamp}`;
    await ParametersModel.updateOne({ _id: id }, { $set: { name: updatedName, deletedAt: new Date() } });
    res.json({ message: 'Parameter deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Search parameters by name
const searchParameter = async (req, res) => {
  const { query = '', page = 1 } = req.params;
  const pageSize = 20;
  const skip = (page - 1) * pageSize;
  try {
    const results = await ParametersModel.find({ name: { $regex: query, $options: 'i' }, deletedAt: null })
      .skip(skip)
      .limit(pageSize)
      .exec();

    const totalResults = await ParametersModel.countDocuments({ title: { $regex: query, $options: 'i' }, isActive: true });

    res.status(200).json({
      results,
      totalResults,
      page,
      totalPages: Math.ceil(totalResults / pageSize),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get parameters by array of IDs
const getParametersByIds = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids)) {
      return res.status(400).json({ error: 'Invalid input. IDs must be provided as an array.' });
    }
    const parameters = await ParametersModel.find({ _id: { $in: ids }, deletedAt: null });
    res.json(parameters);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getParameter,
  createParameter,
  createManyParameters,
  updateParameter,
  deleteParameter,
  searchParameter,
  getParametersByIds
};
