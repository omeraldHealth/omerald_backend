const DoseModel = require('../models/dose');
const DosesModel = require('../models/dose');
const DoseDurationsModel = require('../models/doseDuration');
const VaccinesModel = require('../models/vaccine');
const xlsx = require('xlsx');
// Get all dosess
const getAlldosess = async (req, res) => {
  try {
    const doses = await DosesModel.find({deletedAt: null})
    .populate('duration', 'duration _id')
    .populate('vaccine', 'name _id')
    .exec();
    res.json(doses);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create a new doses
const getdosesById = async (req, res) => {
    try {
        const { id } = req.params;
        const doses = await DosesModel.findById({ deletedAt: null, _id: id})
        .populate('duration', 'duration _id')
        .populate('vaccine', 'name _id')
        .exec();
        res.json(doses);
      } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
      }
};

// Create
const createdosess = async (req, res) => {
    try {
      const { name,duration,vaccine,type} = req.body;
      const doses = await DosesModel.create({ name,duration,vaccine,type});
      if (!doses) {
        return res.status(404).json({ error: 'doses not found' });
      }
      res.json({ message: 'doses added successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
};

// Delete a doses by ID
const createManyDoses = async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const workbook = xlsx.read(req.file.buffer);
  const worksheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[worksheetName];
  const jsonData = xlsx.utils.sheet_to_json(worksheet);

  if (worksheetName === "doses") {
    const existingDoses = await DoseModel.find().select('name -_id');
    const existingNames = new Set(existingDoses.map(dose => dose.name));

    const dosesToInsert = await Promise.all(jsonData.map(async (dose) => {
      if (typeof dose.name !== 'string' || !dose.name || existingNames.has(dose.name)) {
        return undefined; // Skip this entry if invalid or duplicate
      }

      let durationDoc = null, vaccineDoc = null;

      // Fetch and include full duration document based on name
      if (dose.durationValue && dose.durationType) {
        const duration = await DoseDurationsModel.findOne({ 'duration.value': dose.durationValue, 'duration.type': dose.durationType }, '_id').lean();
        durationDoc = duration
      }

      // Fetch and include full vaccine document based on name
      if (dose.vaccine) {
        const vaccine = await VaccinesModel.findOne({ name: dose.vaccine }, 'name').lean(); // Assuming you're fetching by name
        if (vaccine) {
          vaccineDoc = vaccine;
        }
      }

      return {
        name: dose.name,
        duration: durationDoc ? durationDoc._id : null, // Store only the ObjectId
        vaccine: vaccineDoc ? vaccineDoc._id : null, // Store only the ObjectId
        type: dose.type
        // Optionally include more fields from durationDoc and vaccineDoc if needed for processing
      };
    }));

    // Filter out undefined entries and insert in batches of 50
    const filteredDoses = dosesToInsert.filter(dose => dose !== undefined);
    if (filteredDoses.length > 0) {
      const insertedDocuments = [];
      for (let i = 0; i < filteredDoses.length; i += 50) {
        const chunk = filteredDoses.slice(i, i + 50);
        const insertedChunk = await DoseModel.insertMany(chunk);
        insertedDocuments.push(...insertedChunk);
      }

      const insertedIds = insertedDocuments.map(doc => doc._id);
      res.status(200).json({ message: "Doses added successfully", count: insertedIds.length, insertedIds });
    } else {
      res.status(400).json({ message: "Doses already present or found no new entries to add." });
    }
  } else {
    res.status(400).send("Incorrect worksheet name. Please use 'doses'.");
  }
};


const updatedosess = async (req, res) => {
    const { id } = req.body;
    try {
      const doses = await DosesModel.findByIdAndUpdate(id,req.body, { new: true });
      if (!doses) {
        return res.status(404).json({ error: 'doses not found' });
      }
      res.json({ message: 'doses updated successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
};

// const deletedoses = async (req, res) => {
//     const { id } = req.params;
//     try {
//       const doses = await DosesModel.findByIdAndDelete(id);
//       if (!doses) {
//         return res.status(404).json({ error: 'doses not found' });
//       }
//       res.json({ message: 'doses deleted successfully' });
//     } catch (error) {
//       res.status(500).json({ error: 'Internal server error' });
//     }
// };
const deletedoses = async (req, res) => {
  const { id } = req.params;
  try {
    // Fetch the current user to get the phoneNumber
    const doses = await DosesModel.findById(id);
    
    if (!doses) {
      throw new Error('parameter not found');
    }

    // Append current timestamp to phoneNumber
    const timestamp = Date.now();
    const updatedName = `${doses.name}*${timestamp}`;

    // Update phoneNumber and set deletedAt
    await DosesModel.updateOne({ _id: id }, {
      $set: {
        name: updatedName,
        deletedAt: new Date()
      }
    });

    res.json({ message: 'Doses deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
    // Handle error appropriately
  }
};

const getDosesByIds = async (req, res) => {
  try {
      const { ids } = req.body; // Assuming IDs are passed in the request body as an array

      if (!Array.isArray(ids)) {
          return res.status(400).json({ error: 'Invalid input. IDs must be provided as an array.' });
      }

      const doses = await DosesModel.find({ _id: { $in: ids }, deletedAt: null })
          .populate('duration', 'duration _id')
          .populate('vaccine', 'name _id')
          .exec();

      res.json(doses);
  } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
  }
};



module.exports = {
  getAlldosess,
  getdosesById,
  createdosess,
  createManyDoses,
  updatedosess,
  deletedoses,
  getDosesByIds
};
