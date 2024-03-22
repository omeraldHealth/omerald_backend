const expressAsyncHandler = require('express-async-handler');
const xlsx = require('xlsx');
const DiagnoseConditionsModel = require('../models/diagnosedConditions');
const SamplesModel = require('../models/sample');
const ParametersModel = require('../models/parameter');
const ReportsModel = require('../models/reports');
const SampleModel = require('../models/sample');

// Get all reports
const getReport = expressAsyncHandler(async (req, res) => {
  try {
    const reports = await ReportsModel.find({ deletedAt: null }).populate({
      path: 'sample',
      select: 'name description validity',
      model: SamplesModel,
      options: { alias: 'sampleName' },
    }).populate({
      path: 'parameters',
      select: 'name units.value bioRefRange aliases',
      model: ParametersModel,
    }).populate({
      path: 'diagnoseConditions',
      select: 'title description aliases',
      model: DiagnoseConditionsModel,
    }).exec();
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new report
const createReport = expressAsyncHandler(async (req, res) => {
  const { name, description, image, sample, diagnoseConditions, parameters, isActive } = req.body;
  try {
    const report = await ReportsModel.create({ name, description, image, sample, diagnoseConditions, parameters, isActive });
    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' + error });
  }
});

// Create multiple reports from uploaded file
const createManyReport = expressAsyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const workbook = xlsx.read(req.file.buffer);
  const worksheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[worksheetName];
  const jsonData = xlsx.utils.sheet_to_json(worksheet);
  
  if (worksheetName === "reports") {
    const existingReports = await ReportsModel.find().select('name -_id');
    const existingTitles = new Set(existingReports.map(report => report.name));

    const reportsToInsert = await Promise.all(jsonData.map(async (report) => {
      // Split comma-separated values and trim any extra spaces
      const parameterNames = report.parameters.includes(',') ? report.parameters.split(',').map(param => param.trim()) : [report.parameters.trim()];
      const sampleNames = report.sampleType.includes(',') ? report.sampleType.split(',').map(sample => sample.trim()) : [report.sampleType.trim()];
      const diagnosedConditionTitles = report.diagnosedConditions.includes(',') ? report.diagnosedConditions.split(',').map(condition => condition.trim()) : [report.diagnosedConditions.trim()];
    
      // Find IDs for parameters
      const parameters = await ParametersModel.find({ name: { $in: parameterNames.map(name => new RegExp(`\\b${name}\\b`, 'i')) } }).select('_id');
      // Find IDs for samples, excluding specific patterns
      const samples = await SampleModel.find({ name: { $in: sampleNames.map(name => new RegExp(`\\b${name}\\b`, 'i')) } }).select('_id');
      // Find IDs for diagnosed conditions
      const diagnosedConditions = await DiagnoseConditionsModel.find({ title: { $in: diagnosedConditionTitles.map(title => new RegExp(`\\b${title}\\b`, 'i')) } }).select('_id');

      return {
        name: report?.name,
        description: report?.description,
        isActive: true,
        parameters: parameters?.length > 0 ? parameters.map(param => param._id): [],
        sample:  samples?.length > 0 ? samples.map(sample => sample._id): [],
        diagnoseConditions:  diagnosedConditions?.length > 0 ? diagnosedConditions.map(condition => condition._id):[],
      };
    }));

    const validatedData = reportsToInsert.filter(obj => !existingTitles.has(obj.name))

    if (validatedData.length !== 0) {
      // Logic to insert in batches of 50
      const CHUNK_SIZE = 50;
      const insertedReports = [];
      for (let i = 0; i < validatedData.length; i += CHUNK_SIZE) {
        const chunk = validatedData.slice(i, i + CHUNK_SIZE);
        const insertedChunk = await ReportsModel.insertMany(chunk); // Inserts each chunk sequentially
        insertedReports.push(...insertedChunk);
      }

      // Extract inserted IDs from insertedReports
      const insertedIds = insertedReports.map(report => report._id);

      res.status(200).json({ message: "Reports inserted successfully", count: insertedIds.length, insertedIds });
    } else {
      res.status(400).json({ message: "Reports already present or found no entries" });
    }

  } else {
    res.status(400).send("Incorrect worksheet name. Please use 'reports'.");
  }
});


// Update a report by ID
const updateReport = expressAsyncHandler(async (req, res) => {
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
});

// Delete a report by ID
const deleteReport = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const report = await ReportsModel.findById(id);

    if (!report) {
      throw new Error('report not found');
    }

    const timestamp = Date.now();
    const updatedName = `${report.name}*${timestamp}`;

    await ReportsModel.updateOne({ _id: id }, {
      $set: {
        name: updatedName,
        deletedAt: new Date()
      }
    });

    res.json({ message: 'Report deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get reports by array of IDs
const getReportsByIds = expressAsyncHandler(async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids)) {
      return res.status(400).json({ error: 'Invalid input. IDs must be provided as an array.' });
    }

    const reports = await ReportsModel.find({ _id: { $in: ids }, deletedAt: null })
      .populate({
        path: 'sample',
        select: 'name description validity',
        model: SamplesModel,
        options: { alias: 'sampleName' },
      })
      .populate({
        path: 'parameters',
        select: 'name units.value bioRefRange aliases',
        model: ParametersModel,
      })
      .populate({
        path: 'diagnoseConditions',
        select: 'title description aliases',
        model: DiagnoseConditionsModel,
      })
      .exec();

    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = {
  getReport,
  createReport,
  createManyReport,
  updateReport,
  deleteReport,
  getReportsByIds
};
