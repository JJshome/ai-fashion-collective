const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DesignSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  thumbnailUrl: {
    type: String
  },
  designData: {
    type: Object,
    required: true
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  contributors: [{
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    contributionWeight: {
      type: Number,
      default: 0
    }
  }],
  evaluations: [{
    type: Schema.Types.ObjectId,
    ref: 'Evaluation'
  }],
  status: {
    type: String,
    enum: ['draft', 'in_review', 'completed', 'archived'],
    default: 'draft'
  },
  isAIGenerated: {
    type: Boolean,
    default: false
  },
  version: {
    type: Number,
    default: 1
  },
  parentDesign: {
    type: Schema.Types.ObjectId,
    ref: 'Design'
  },
  nftData: {
    tokenId: String,
    contractAddress: String,
    blockchain: String,
    metadataUrl: String
  },
  tags: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Updating the updatedAt field on save
DesignSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual for design URL
DesignSchema.virtual('url').get(function() {
  return `/designs/${this._id}`;
});

module.exports = mongoose.model('Design', DesignSchema);
