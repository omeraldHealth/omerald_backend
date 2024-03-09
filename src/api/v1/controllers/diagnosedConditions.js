const expressAsyncHandler = require('express-async-handler');
const DiagnoseConditionsModel = require('../models/diagnosedConditions');
const xlsx = require('xlsx');

// Get all DiagnosedConditions
const getAllDiagnosedConditions = async (req, res) => {
  try {
    const diagnosedCondition = await DiagnoseConditionsModel.find({ deletedAt: null });
    res.json(diagnosedCondition);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create a new diagnosedCondition
const getDiagnosedConditionById = async (req, res) => {
    try {
        const { id } = req.params;
        const diagnosedCondition = await DiagnoseConditionsModel.findById({deletedAt: null, _id: id});
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

// const deleteDiagnosedCondition = async (req, res) => {
//     const { id } = req.params;
//     try {
//       const diagnosedCondition = await DiagnoseConditionsModel.findByIdAndDelete(id);
//       if (!diagnosedCondition) {
//         return res.status(404).json({ error: 'diagnosedCondition not found' });
//       }
//       res.json({ message: 'diagnosedCondition deleted successfully' });
//     } catch (error) {
//       res.status(500).json({ error: 'Internal server error' });
//     }
// };

const deleteDiagnosedCondition = async (req, res) => {
  const { id } = req.params;
  try {
    // Fetch the current user to get the phoneNumber
    const doses = await DiagnoseConditionsModel.findById(id);
    
    if (!doses) {
      throw new Error('parameter not found');
    }

    // Append current timestamp to phoneNumber
    const timestamp = Date.now();
    const updatedName = `${doses.title}*${timestamp}`;

    // Update phoneNumber and set deletedAt
    await DiagnoseConditionsModel.updateOne({ _id: id }, {
      $set: {
        title: updatedName,
        deletedAt: new Date()
      }
    });

    res.json({ message: 'Diagnosed Condition deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
    // Handle error appropriately
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

const createManyDiagnosedConditions = expressAsyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  
  const workbook = xlsx.read(req.file.buffer);
  const worksheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[worksheetName];
  const jsonData = xlsx.utils.sheet_to_json(worksheet);

  if (worksheetName === "diagnosedCondition") {
    const existingConditions = await DiagnoseConditionsModel.find().select('title -_id');
    const existingTitles = new Set(existingConditions.map(cond => cond.title));

    const validatedData = jsonData.filter(obj => !existingTitles.has(obj.title)).map(obj => {
      // Convert comma-separated aliases to arrays and ensure all fields are validated
      if (typeof obj.aliases === 'string') {
        obj.aliases = obj.aliases.split(',');
      }

      // Validate each field according to the schema
      const validatedObj = {
        title: typeof obj.title === 'string' ? obj.title : null,
        description: typeof obj.description === 'string' ? obj.description : '',
        imageUrl: typeof obj.imageUrl === 'string' ? obj.imageUrl : '',
        aliases: Array.isArray(obj.aliases) ? obj.aliases.filter(alias => typeof alias === 'string') : [],
        isActive: typeof obj.isActive === 'boolean' ? obj.isActive : false,
        healthTopicLinks: Array.isArray(obj.healthTopicLinks) ? obj.healthTopicLinks.map(link => ({
          id: typeof link.id === 'number' ? link.id : null,
          title: typeof link.title === 'string' ? link.title : '',
          url: typeof link.url === 'string' ? link.url : '',
          label: typeof link.label === 'string' ? link.label : '',
          value: typeof link.value === 'string' ? link.value : '',
        })).filter(link => link.id !== null) : [],
      };

      // Only proceed with objects that have a valid title
      return validatedObj.title ? validatedObj : null;
    }).filter(obj => obj !== null);

    const chunkedData = [];
    for (let i = 0; i < validatedData.length; i += 50) {
      chunkedData.push(validatedData.slice(i, i + 50));
    }

    const results = [];
    for (const chunk of chunkedData) {
      const updates = chunk.map(item => ({
        updateOne: {
          filter: { title: item.title },
          update: item,
          upsert: true
        }
      }));

      const result = await DiagnoseConditionsModel.bulkWrite(updates);
      results.push(result);
    }

    res.status(200).json(results);
  } else {
    res.status(400).send("Incorrect worksheet name. Please use 'diagnosedCondition'.");
  }
});

module.exports = {
  getAllDiagnosedConditions,
  getDiagnosedConditionById,
  createDiagnosedConditions,
  createManyDiagnosedConditions,
  updateDiagnosedConditions,
  deleteDiagnosedCondition,
  searchDiagnosedCondition
};
