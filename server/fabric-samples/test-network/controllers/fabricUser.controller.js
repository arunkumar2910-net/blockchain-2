const { submitTx, queryTx } = require('../utils/fabricUtils');

/**
 * Register a new user on Fabric
 */
exports.registerUser = async (req, res) => {
  try {
    const { userId, firstName, lastName, email, role } = req.body;
    const result = await submitTx('registerUser', userId, firstName, lastName, email, role);
    res.status(201).json({ success: true, user: JSON.parse(result) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get user data by userId from Fabric
 */
exports.getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await queryTx('getUserById', userId);
    res.status(200).json({ success: true, user: JSON.parse(result) });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};