const expressAsyncHandler = require('express-async-handler');
const xlsx = require('xlsx');
const DiagnoseConditionsModel = require('../models/diagnosedConditions');
const SamplesModel = require('../models/sample');
const ParametersModel = require('../models/parameter');
const ReportsModel = require('../models/reports');

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
    const existingTitles = new Set(existingReports.map(cond => cond.name));
    const reportsToInsert = await Promise.all(jsonData.map(async (report) => {
        let sample = null;
        let diagnoseConditions = [];
        let parameters = [];
  
        // Validate simple fields
        if (typeof report.name !== 'string' || !report.name) throw new Error('Name is required and must be a string');
        if (report.description && typeof report.description !== 'string') throw new Error('Description must be a string');
        if (report.imageUrl && typeof report.imageUrl !== 'string') throw new Error('ImageUrl must be a string');
        if (report.isActive && typeof report.isActive !== 'boolean') throw new Error('IsActive must be a boolean');
        if (report.sample && typeof report.sample !=='string') throw new Error('Sample must be a string');
        if (report.diagnoseConditions && typeof report.diagnoseConditions !=='string') throw new Error('DiagnoseConditions must be a string');
        if (report.parameters && typeof report.parameters !=='string') throw new Error('Parameters must be a string');
  
        // Fetch and replace sample name with its full document {_id, name}
        if (report.sample) {
          sample = await SamplesModel.findOne({ name: report.sample }, '_id name').lean();
          if (sample) {
            sample = { _id: sample._id, name: sample.name }; // Ensuring only _id and name are included
          }
        }
  
        // Fetch and replace diagnoseConditions names with their full documents {_id, name}
        if (report.diagnoseConditions) {
          const conditionsNames = report.diagnoseConditions.split(',');
          const conditionsDocs = await DiagnoseConditionsModel.find({ name: { $in: conditionsNames } }, '_id name').lean();
          diagnoseConditions = conditionsDocs.map(dc => ({ _id: dc._id, name: dc.name }));
        }
  
        // Fetch and replace parameters names with their full documents {_id, name}
        if (report.parameters) {
          const parametersNames = report.parameters.split(',');
          const parametersDocs = await ParametersModel.find({ name: { $in: parametersNames } }, '_id name').lean();
          parameters = parametersDocs.map(p => ({ _id: p._id, name: p.name }));
        }

      return {
        ...report,
        sample: sample,
        diagnoseConditions: diagnoseConditions,
        parameters: parameters
      };
    }));
    const validatedData = reportsToInsert.filter(obj => !existingTitles.has(obj.name))

    if(validatedData.length !== 0) {
      // Logic to insert in batches of 50
      const CHUNK_SIZE = 50;
      for (let i = 0; i < validatedData.length; i += CHUNK_SIZE) {
        const chunk = validatedData.slice(i, i + CHUNK_SIZE);
        await ReportsModel.insertMany(chunk); // Inserts each chunk sequentially
        res.status(200).json({ message: "Reports inserted successfully", count: validatedData.length });
      }
    } else {
      res.status(400).json({ message: "Reports already present or found no entries" });
    }

  } else {
    res.status(400).send("Incorrect worksheet name. Please use 'reports'.");
  }
});

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
// const deletereport = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const report = await ReportsModel.findByIdAndDelete(id);
//     if (!report) {
//       return res.status(404).json({ error: 'report not found' });
//     }
//     res.json({ message: 'report deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };
const deletereport = async (req, res) => {
  const { id } = req.params;
  try {
    // Fetch the current user to get the phoneNumber
    const report = await ReportsModel.findById(id);
    
    if (!report) {
      throw new Error('sample not found');
    }

    // Append current timestamp to phoneNumber
    const timestamp = Date.now();
    const updatedName = `${report.name}*${timestamp}`;

    // Update phoneNumber and set deletedAt
    await ReportsModel.updateOne({ _id: id }, {
      $set: {
        name: updatedName,
        deletedAt: new Date()
      }
    });

    res.json({ message: 'Report deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
    // Handle error appropriately
  }
};


module.exports = {
  getReport,
  createReport,
  createManyReport,
  updateReport,
  deletereport,
};
