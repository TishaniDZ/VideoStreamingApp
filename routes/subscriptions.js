const express = require('express');
const router = express.Router();
const Plan = require('../Models/plan');

// @route   GET api/subscriptions
// @desc    Get all subscription plans
// @access  Public
router.get('/', async (req, res) => {
  try {
    const plans = await Plan.find();
    res.json(plans);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
