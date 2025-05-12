const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EvaluationSchema = new Schema({
  design: {
    type: Schema.Types.ObjectId,
    ref: 'Design',
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: false
  },
  comment: {
    type: String
  },
  modifications: {
    type: Object, // Stores specific modifications made
    default: {}
  },
  modifiedImageUrl: {
    type: String // If the user uploads a modified image
  },
  modifiedDesignData: {
    type: Object // Stores the modified design data
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  aiScore: {
    type: Number,
    min: 0,
    max: 100
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

// Update the updatedAt field on save
EvaluationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Evaluation', EvaluationSchema);
