const mongoose = require('mongoose');

const PlanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  price: {
    type: Number,
    required: true
  },
  videoQuality: {
    type: String,
    required: true
  },
  resolution: {
    type: String,
    required: true
  },
  spatialAudio: {
    type: Boolean,
    default: true
  },
  supportedDevices: {
    type: [String],
    required: true
  },
  concurrentStreams: {
    type: Number,
    required: true
  },
  downloadDevices: {
    type: Number,
    required: true
  }
});

const Plan = mongoose.model('Plan', PlanSchema);

module.exports = Plan;
