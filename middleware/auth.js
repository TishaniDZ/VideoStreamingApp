
const jwt = require('jsonwebtoken');
const Blacklist = require('../Models/blacklist');
require('dotenv').config();

module.exports = function (req, res, next) {
  // Get token from cookies
  const token = req.cookies.token;

  // Check if no token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Check if token is blacklisted
  Blacklist.findOne({ token }, (err, data) => {
    if (err) {
      return res.status(500).json({ msg: 'Server error' });
    }

    if (data) {
      return res.status(401).json({ msg: 'Token is blacklisted, authorization denied' });
    }

    // Verify token
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach the user to the request object
      req.user = decoded.user;
      next();
    } catch (err) {
      return res.status(401).json({ msg: 'Token is not valid' });
    }
  });
};

