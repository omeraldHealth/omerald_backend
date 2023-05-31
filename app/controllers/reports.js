const ParametersModel = require('../models/parameter');

const ReportsModel = require('../models/reports');
const SamplesModel = require('../models/sample');

// Get all report
const getReport = async (req, res) => {
  try {
    const report = await ReportsModel.find()
    .populate({
      path: 'sample',
      select: 'name',
      model: SamplesModel,
      options: { alias: 'sampleName' },
    })
    .populate({
      path: 'parameters',
      select: 'name units.value bioRefRange aliases',
      // populate: { path: "units" },
      model: ParametersModel,
    })
    .exec();;
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create a new report
const createReport = async (req, res) => {

  const { name,description,imaeg,sample,diagnoseConditions,parameters,isActive } = req.body;
  try {
    const report = await ReportsModel.create({name,description,imaeg,sample,diagnoseConditions,parameters,isActive});
    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' + error });
  }
};

const createManyReport = async (req, res) => {
    try {
      const report = await ReportsModel.create(req.body);
      res.status(201).json(report);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' + error });
    }
  };

// Update a report by ID
const updateReport = async (req, res) => {
  const { id } = req.body;
  try {
    const report = await ReportsModel.findByIdAndUpdate(id, req.body, { new: true });
    if (!report) {
      return res.status(404).json({ error: 'report not found' });
    }
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete a report by ID
const deletereport = async (req, res) => {
  const { id } = req.params;
  try {
    const report = await ReportsModel.findByIdAndDelete(id);
    if (!report) {
      return res.status(404).json({ error: 'report not found' });
    }
    res.json({ message: 'report deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getReport,
  createReport,
  createManyReport,
  updateReport,
  deletereport,
};
