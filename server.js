
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const WebSocket = require('ws');
const nodemailer = require('nodemailer');
const cookieParser = require('cookie-parser'); // Added for cookie parsing
const User = require('./Models/user');
require('dotenv').config();
const authRoutes = require('./routes/auth');
const subscriptionRoutes = require('./routes/subscriptions');

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Middleware
app.use(express.json());
app.use(cookieParser()); // Added middleware for parsing cookies

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/subscriptions', subscriptionRoutes);

const PORT = process.env.PORT || 5000;

// Create an HTTP server to integrate with WebSocket
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// WebSocket setup
const wss = new WebSocket.Server({ server });

// Configure the email transport
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

wss.on('connection', (ws) => {
  console.log('New client connected');

  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message);

      if (data.type === 'register') {
        const { email, password } = data;
        let user = await User.findOne({ email });

        if (user) {
          ws.send(JSON.stringify({ type: 'error', message: 'User already exists' }));
          return;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        console.log('Hashed Password (WS):', hashedPassword); // Debugging line

        user = new User({ email, password: hashedPassword });
        await user.save();

        const payload = {
          user: {
            id: user.id
          }
        };

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
          if (err) throw err;
          ws.send(JSON.stringify({ type: 'register_success', token }));
          sendRegistrationEmail(email, process.env.ADMIN_EMAIL);
        });

      } else if (data.type === 'login') {
        const { email, password } = data;
        let user = await User.findOne({ email });

        if (!user) {
          ws.send(JSON.stringify({ type: 'error', message: 'Invalid Credentials' }));
          return;
        }

        console.log('User found (WS):', user);

        const isMatch = await bcrypt.compare(password, user.password);

        console.log('Hashed Password (DB):', user.password); // Debugging line
        console.log('Password Entered:', password); // Debugging line

        if (!isMatch) {
          ws.send(JSON.stringify({ type: 'error', message: 'Invalid Credentials' }));
          return;
        }

        const payload = {
          user: {
            id: user.id
          }
        };

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
          if (err) throw err;
          ws.send(JSON.stringify({ type: 'login_success', token, redirectUrl: '/subscription' }));
        });
      }

    } catch (error) {
      ws.send(JSON.stringify({ type: 'error', message: 'Server error' }));
      console.error(error);
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

