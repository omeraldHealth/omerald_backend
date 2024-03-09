const ParametersModel = require('../models/parameter');
const xlsx = require('xlsx');

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

const createManyParameters = async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const workbook = xlsx.read(req.file.buffer);
  const worksheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[worksheetName];
  const jsonData = xlsx.utils.sheet_to_json(worksheet);

  if (worksheetName === "parameters") {
    // Fetch existing parameters to avoid duplicates
    const existingParameters = await ParametersModel.find().select('name -_id');
    const existingNames = new Set(existingParameters.map(param => param.name));
  
    // Validate and prepare data
    const validatedData = jsonData.filter(param => {
      // Perform initial filtering to remove existing names
      return !existingNames.has(param.name);
    }).map(param => {
      // Validate and transform each parameter entry according to the schema
      // Note: Here you should include the logic to validate and possibly transform
      // the bioRefRange and any other complex fields according to your needs.
      
      return {
        name: typeof param.name === 'string' ? param.name : null,
        description: typeof param.description === 'string' ? param.description : '',
        aliases: Array.isArray(param.aliases) ? param.aliases : (typeof param.aliases === 'string' ? param.aliases.split(',') : []),
        units: typeof param.units === 'string' ? param.units : '',
        // Add logic to validate and transform bioRefRange here
        isActive: typeof param.isActive === 'boolean' ? param.isActive : false,
        // Assuming bioRefRange and other complex fields are handled correctly
      };
    }).filter(param => param.name !== null); // Ensure we only proceed with valid entries

    // Batch insert while respecting the limit of 50 entries
    const results = [];
    for (let i = 0; i < validatedData.length; i += 50) {
      const batch = validatedData.slice(i, i + 50);
      const insertResult = await ParametersModel.insertMany(batch);
      results.push(insertResult);
    }

    if (results.length > 0) {
      res.status(200).json({ message: "Parameters inserted successfully", count: validatedData.length });
    } else {
      res.status(400).json({ message: "No new parameters were added. They may already be present or the file was empty." });
    }
  } else {
    res.status(400).send("Incorrect worksheet name. Please use 'parameters'.");
  }
};

// Update a parameter by ID
const updateParameter = async (req, res) => {
  const { id } = req.body;
  delete req.body.id
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
// const deleteparameter = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const parameter = await ParametersModel.findByIdAndDelete(id);
//     if (!parameter) {
//       return res.status(404).json({ error: 'parameter not found' });
//     }
//     res.json({ message: 'parameter deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };
const deleteparameter = async (req, res) => {
  const { id } = req.params;
  try {
    // Fetch the current user to get the phoneNumber
    const parameter = await ParametersModel.findById(id);
    
    if (!parameter) {
      throw new Error('parameter not found');
    }

    // Append current timestamp to phoneNumber
    const timestamp = Date.now();
    const updatedName = `${parameter.name}*${timestamp}`;

    // Update phoneNumber and set deletedAt
    await ParametersModel.updateOne({ _id: id }, {
      $set: {
        name: updatedName,
        deletedAt: new Date()
      }
    });

    res.json({ message: 'Parameter deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
    // Handle error appropriately
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
  createManyParameters,
  createParameter,
  searchParameter,
  updateParameter,
  deleteparameter,
};
