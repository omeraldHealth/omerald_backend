const User = require('../models/userModel');

// Get all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get a user by phone number
const getUserByPhoneNumber = async (req, res) => {
    const { phoneNumber } = req.params;

    try {
      const user = await User.findOne({ phoneNumber });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
};

// Create a new user
const createUser = async (req, res) => {
  const { userName, phoneNumber, role } = req.body;
  try {
    const user = await User.create({ userName, phoneNumber, role });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' + error });
  }
};

// Update a user by ID
const updateUser = async (req, res) => {
  const { id, userName, phoneNumber, role } = req.body;
  try {
    const user = await User.findByIdAndUpdate(id, { userName, phoneNumber, role }, { new: true });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete a user by ID
// const deleteUser = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const user = await User.findByIdAndDelete(id);
//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }
//     res.json({ message: 'User deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ error: 'Internal server error' });
//   }
// };

//Using soft delete for user
const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    // Fetch the current user to get the phoneNumber
    const user = await User.findById(id);
    
    if (!user) {
      throw new Error('User not found');
    }

    // Append current timestamp to phoneNumber
    const timestamp = Date.now();
    const updatedPhoneNumber = `${user.phoneNumber}*${timestamp}`;

    // Update phoneNumber and set deletedAt
    await User.updateOne({ _id: id }, {
      $set: {
        phoneNumber: updatedPhoneNumber,
        deletedAt: new Date()
      }
    });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
    // Handle error appropriately
  }
};

const revertDeleteUser = async (req, res) => {
  const { id } = req.params;
  try {
        const user = await User.findByIdAndUpdate(id,{ deletedAt:null });
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
  }
};


module.exports = {
  getUsers,
  getUserByPhoneNumber,
  createUser,
  updateUser,
  deleteUser,
  revertDeleteUser
};
