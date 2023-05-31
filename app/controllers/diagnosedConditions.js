const DiagnoseConditionsModel = require('../models/diagnosedConditions');

// Get all DiagnosedConditions
const getAllDiagnosedConditions = async (req, res) => {
  try {
    const diagnosedCondition = await DiagnoseConditionsModel.find();
    res.json(diagnosedCondition);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create a new diagnosedCondition
const getDiagnosedConditionById = async (req, res) => {
    try {
        const { id } = req.params;
        const diagnosedCondition = await DiagnoseConditionsModel.findById(id);
        res.json(diagnosedCondition);
      } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
      }
};

// Create
const createDiagnosedConditions = async (req, res) => {
    try {
      const { title, description,imageUrl,aliases,isActive,healthTopicLinks} = req.body;
      const diagnosedCondition = await DiagnoseConditionsModel.create({title, description,imageUrl,aliases,isActive,healthTopicLinks});
      if (!diagnosedCondition) {
        return res.status(404).json({ error: 'diagnosedCondition not found' });
      }
      res.json({ message: 'diagnosedCondition added successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
};

// Delete a diagnosedCondition by ID
const createManyDiagnosedConditions = async (req, res) => {
  try {
    const diagnosedCondition = await DiagnoseConditionsModel.insertMany(req.body);
    if (!diagnosedCondition) {
      return res.status(404).json({ error: 'diagnosedCondition not found' });
    }
    res.json({ message: 'diagnosedCondition deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateDiagnosedConditions = async (req, res) => {
    const { id } = req.body;
    try {
      const diagnosedCondition = await DiagnoseConditionsModel.findByIdAndUpdate(id,req.body, { new: true });
      if (!diagnosedCondition) {
        return res.status(404).json({ error: 'diagnosedCondition not found' });
      }
      res.json({ message: 'diagnosedCondition updated successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
};

const deleteDiagnosedCondition = async (req, res) => {
    const { id } = req.params;
    try {
      const diagnosedCondition = await DiagnoseConditionsModel.findByIdAndDelete(id);
      if (!diagnosedCondition) {
        return res.status(404).json({ error: 'diagnosedCondition not found' });
      }
      res.json({ message: 'diagnosedCondition deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
};

const searchDiagnosedCondition = async (req, res) => {
    const { query = '', page = 1 } = req.params;
    const pageSize = 20;
    const skip = (page - 1) * pageSize;

    try {
        const results = await DiagnoseConditionsModel.find({
            title: { $regex: query, $options: 'i' },
            isActive: true,
          })
            .skip(skip)
            .limit(pageSize)
            .exec();

            const totalResults = await DiagnoseConditionsModel.countDocuments({
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
  getAllDiagnosedConditions,
  getDiagnosedConditionById,
  createDiagnosedConditions,
  createManyDiagnosedConditions,
  updateDiagnosedConditions,
  deleteDiagnosedCondition,
  searchDiagnosedCondition
};
