const { Design, User, Evaluation } = require('../models');

// Get all designs
exports.getDesigns = async (req, res) => {
  try {
    const designs = await Design.find()
      .populate('creator', 'username email profileImage')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: designs.length,
      data: designs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Get single design
exports.getDesign = async (req, res) => {
  try {
    const design = await Design.findById(req.params.id)
      .populate('creator', 'username email profileImage')
      .populate({
        path: 'evaluations',
        populate: {
          path: 'user',
          select: 'username profileImage'
        }
      })
      .populate({
        path: 'contributors.user',
        select: 'username email profileImage'
      });
    
    if (!design) {
      return res.status(404).json({
        success: false,
        error: 'Design not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: design
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        error: 'Design not found'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Create new design
exports.createDesign = async (req, res) => {
  try {
    const { name, description, imageUrl, designData } = req.body;
    
    // Create design
    const design = await Design.create({
      name,
      description,
      imageUrl,
      designData,
      creator: req.user.id
    });
    
    // Add design to user's designs
    await User.findByIdAndUpdate(
      req.user.id,
      { $push: { designs: design._id } }
    );
    
    res.status(201).json({
      success: true,
      data: design
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Update design
exports.updateDesign = async (req, res) => {
  try {
    let design = await Design.findById(req.params.id);
    
    if (!design) {
      return res.status(404).json({
        success: false,
        error: 'Design not found'
      });
    }
    
    // Check if user is design creator
    if (design.creator.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this design'
      });
    }
    
    design = await Design.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      data: design
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Delete design
exports.deleteDesign = async (req, res) => {
  try {
    const design = await Design.findById(req.params.id);
    
    if (!design) {
      return res.status(404).json({
        success: false,
        error: 'Design not found'
      });
    }
    
    // Check if user is design creator
    if (design.creator.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this design'
      });
    }
    
    // Remove design from user's designs
    await User.findByIdAndUpdate(
      design.creator,
      { $pull: { designs: design._id } }
    );
    
    // Delete all evaluations related to the design
    await Evaluation.deleteMany({ design: design._id });
    
    // Delete the design
    await design.remove();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Get AI-generated designs
exports.getAIDesigns = async (req, res) => {
  try {
    const designs = await Design.find({ isAIGenerated: true })
      .populate('creator', 'username email profileImage')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: designs.length,
      data: designs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Get designs by creator
exports.getDesignsByCreator = async (req, res) => {
  try {
    const designs = await Design.find({ creator: req.params.userId })
      .populate('creator', 'username email profileImage')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: designs.length,
      data: designs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};
