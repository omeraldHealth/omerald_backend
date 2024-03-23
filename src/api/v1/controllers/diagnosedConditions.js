const expressAsyncHandler = require('express-async-handler');
const DiagnoseConditionsModel = require('../models/diagnosedConditions');
const xlsx = require('xlsx');

// Get all DiagnosedConditions
exports.getAllDiagnosedConditions = expressAsyncHandler(async (req, res) => {
  const diagnosedCondition = await DiagnoseConditionsModel.find({ deletedAt: null });
  res.json(diagnosedCondition);
});

// Get DiagnosedCondition by ID
exports.getDiagnosedConditionById = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  const diagnosedCondition = await DiagnoseConditionsModel.findOne({ _id: id, deletedAt: null });
  if (!diagnosedCondition) {
    return res.status(404).json({ error: 'DiagnosedCondition not found' });
  }
  res.json(diagnosedCondition);
});

// Create a new DiagnosedCondition
exports.createDiagnosedConditions = expressAsyncHandler(async (req, res) => {
  let { title, description, imageUrl, aliases, isActive, healthTopicLinks } = req.body;

  const diagnosedCondition = await DiagnoseConditionsModel.create({
    title,
    description,
    imageUrl,
    aliases,
    isActive,
    healthTopicLinks
  });
  res.status(201).json({ message: 'DiagnosedCondition added successfully', diagnosedCondition });
});


// Update DiagnosedCondition by ID
exports.updateDiagnosedConditions = async (req, res) => {
  const { id } = req.body;
  const diagnosedCondition = await DiagnoseConditionsModel.findByIdAndUpdate(id, req.body, { new: true });
  if (!diagnosedCondition) {
    return res.status(404).json({ error: 'DiagnosedCondition not found' });
  }
  res.json({ message: 'DiagnosedCondition updated successfully', diagnosedCondition });
};

// Soft delete DiagnosedCondition by ID
exports.deleteDiagnosedCondition = async (req, res) => {
    const { id } = req.params;
  
    // Retrieve the current document to access its title
    const diagnosedCondition = await DiagnoseConditionsModel.findById(id);

    if (!diagnosedCondition) {
      return res.status(404).json({ error: 'DiagnosedCondition not found' });
    }

    // Generate a timestamp string
    const timestamp = new Date().toISOString().replace(/:/g, '-'); // Replace colons to avoid file path issues
    const updatedTitle = `${diagnosedCondition.title}_deleted_${timestamp}`;

    // Update the document to append the timestamp to its title and set the deletedAt field
    await DiagnoseConditionsModel.findByIdAndUpdate(id, {
      $set: {
        title: updatedTitle,
        deletedAt: new Date()
      }
    });

    res.json({ message: 'DiagnosedCondition deleted successfully' });
};

// Search DiagnosedConditions
exports.searchDiagnosedCondition = async (req, res) => {
  const { query = '', page = 1 } = req.query;
  const pageSize = 20;
  const skip = (page - 1) * pageSize;

  const results = await DiagnoseConditionsModel.find({
    title: { $regex: query, $options: 'i' },
    isActive: true,
    deletedAt: null
  }).skip(skip).limit(pageSize);

  const totalResults = await DiagnoseConditionsModel.countDocuments({
    title: { $regex: query, $options: 'i' },
    isActive: true,
    deletedAt: null
  });
  res.status(200).json({
    results,
    totalResults,
    page,
    totalPages: Math.ceil(totalResults / pageSize)
  });
};

// Create multiple DiagnosedConditions from Excel file
exports.createManyDiagnosedConditions = expressAsyncHandler(async (req, res) => {
  if (!req.file || !req.file.buffer) {
    return res.status(400).send('No file uploaded.');
  }

  const workbook = xlsx.read(req.file.buffer);
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const jsonData = xlsx.utils.sheet_to_json(worksheet);

  const processedData = jsonData.map(data => ({
    title: data.title,
    description: data.description || '',
    imageUrl: data.imageUrl || '',
    aliases: data.aliases ? data.aliases.split(',') : [],
    isActive : data?.isActive?.toLowerCase() === "true"? true: false,
  }));

  // Filter out duplicates based on title
  const existingTitles = await DiagnoseConditionsModel.find({
    title: { $in: processedData.map(data => data.title) }
  }).select('title');

  const existingTitlesSet = new Set(existingTitles.map(item => item.title));
  const uniqueData = processedData.filter(data => !existingTitlesSet.has(data.title));

  if (uniqueData.length === 0) {
    return res.status(400).send('All data are duplicates and were not inserted.');
  }

  await DiagnoseConditionsModel.insertMany(uniqueData, { ordered: false, rawResult: true });
  res.status(200).json({ message: `${uniqueData.length} DiagnosedConditions inserted successfully` });

});

// Get DiagnosedConditions by IDs
exports.getDiagnosedConditionsByIds = expressAsyncHandler(async (req, res) => {
  const { ids } = req.body;
  const diagnosedConditions = await DiagnoseConditionsModel.find({ _id: { $in: ids }, deletedAt: null });
  res.json(diagnosedConditions);
});
