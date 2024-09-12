const express = require('express');
const User = require('../Models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const Blacklist = require('../Models/blacklist');
require('dotenv').config();

const router = express.Router();

// Configure the email transport
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Function to send registration email to admin
function sendRegistrationEmail(userEmail, adminEmail) {
  const adminMailOptions = {
    from: process.env.EMAIL_USER,
    to: adminEmail,
    subject: 'New User Registration',
    text: `A new user has registered with the email: ${userEmail}`
  };

  transporter.sendMail(adminMailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email to admin:', error);
    } else {
      console.log('Admin email sent:', info.response);
    }
  });
}

// @route   POST api/auth/register
// @desc    Register a user
// @access  Public
// Registration
router.post(
  '/register',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      user = new User({
        email,
        password: hashedPassword
      });

      await user.save();

      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '1h' },
        (err, token) => {
          if (err) throw err;
          res.cookie('token', token, { httpOnly: true });
          res.json({ token, redirectUrl: '/subscription' });
          sendRegistrationEmail(email, process.env.ADMIN_EMAIL);
        }
      );
    } catch (err) {
      console.error('Server error:', err.message);
      res.status(500).send('Server error');
    }
  }
);

router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // Retrieve the user
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      // Debug logs
      console.log('Hashed Password (Stored):', user.password);
      console.log('Password Entered:', password);

      // Compare passwords
      const isMatch = await bcrypt.compare(password, user.password);
      console.log('Password Match:', isMatch);

      if (!isMatch) {
        return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      // Generate JWT token
      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '1h' },
        (err, token) => {
          if (err) throw err;
          res.cookie('token', token, { httpOnly: true });
          res.json({ token, redirectUrl: '/subscription' });
        }
      );
    } catch (err) {
      console.error('Server error:', err);
      res.status(500).send('Server error');
    }
  }
);



// @route   POST api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', (req, res) => {
  const token = req.cookies.token; // Get token from cookies
  if (!token) {
    return res.status(400).json({ msg: 'No token, authorization denied' });
  }

  const blacklistedToken = new Blacklist({ token });
  blacklistedToken.save()
    .then(() => res.json({ msg: 'Logged out successfully' }))
    .catch(err => res.status(500).json({ msg: 'Server error' }));
});

module.exports = router;
