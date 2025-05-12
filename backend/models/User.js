const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  profileImage: {
    type: String
  },
  bio: {
    type: String
  },
  role: {
    type: String,
    enum: ['user', 'designer', 'admin'],
    default: 'user'
  },
  designs: [{
    type: Schema.Types.ObjectId,
    ref: 'Design'
  }],
  evaluations: [{
    type: Schema.Types.ObjectId,
    ref: 'Evaluation'
  }],
  contributions: [{
    design: {
      type: Schema.Types.ObjectId,
      ref: 'Design'
    },
    contributionWeight: {
      type: Number,
      default: 0
    }
  }],
  walletAddress: {
    type: String
  },
  preferences: {
    notificationSettings: {
      email: {
        type: Boolean,
        default: true
      },
      inApp: {
        type: Boolean,
        default: true
      }
    },
    designPreferences: {
      types: [String],
      colors: [String],
      styles: [String]
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  this.updatedAt = Date.now();
  next();
});

// Method to check password
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT token
UserSchema.methods.generateAuthToken = function() {
  return jwt.sign(
    { id: this._id, role: this.role },
    config.jwtSecret,
    { expiresIn: '30d' }
  );
};

module.exports = mongoose.model('User', UserSchema);
