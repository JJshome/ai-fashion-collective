const { Evaluation, Design, User } = require('../models');

// Get all evaluations
exports.getEvaluations = async (req, res) => {
  try {
    const evaluations = await Evaluation.find()
      .populate('design', 'name imageUrl')
      .populate('user', 'username profileImage')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: evaluations.length,
      data: evaluations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Get evaluations for a specific design
exports.getDesignEvaluations = async (req, res) => {
  try {
    const evaluations = await Evaluation.find({ design: req.params.designId })
      .populate('user', 'username profileImage')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: evaluations.length,
      data: evaluations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Get evaluations by a specific user
exports.getUserEvaluations = async (req, res) => {
  try {
    const evaluations = await Evaluation.find({ user: req.params.userId })
      .populate('design', 'name imageUrl')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: evaluations.length,
      data: evaluations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Create evaluation
exports.createEvaluation = async (req, res) => {
  try {
    const { designId, rating, comment, modifications, modifiedImageUrl, modifiedDesignData } = req.body;
    
    // Check if design exists
    const design = await Design.findById(designId);
    
    if (!design) {
      return res.status(404).json({
        success: false,
        error: 'Design not found'
      });
    }
    
    // Check if user has already evaluated this design
    const existingEvaluation = await Evaluation.findOne({
      design: designId,
      user: req.user.id
    });
    
    if (existingEvaluation) {
      return res.status(400).json({
        success: false,
        error: 'You have already evaluated this design'
      });
    }
    
    // Create evaluation
    const evaluation = await Evaluation.create({
      design: designId,
      user: req.user.id,
      rating,
      comment,
      modifications,
      modifiedImageUrl,
      modifiedDesignData
    });
    
    // Add evaluation to design and user
    await Design.findByIdAndUpdate(
      designId,
      { $push: { evaluations: evaluation._id } }
    );
    
    await User.findByIdAndUpdate(
      req.user.id,
      { $push: { evaluations: evaluation._id } }
    );
    
    // If this user made modifications, add them as a contributor to the design
    if (modifications || modifiedImageUrl || modifiedDesignData) {
      // Calculate a simple contribution weight - could be more sophisticated
      const contributionWeight = 0.1; // 10% contribution
      
      await Design.findByIdAndUpdate(
        designId,
        { 
          $push: { 
            contributors: {
              user: req.user.id,
              contributionWeight
            } 
          } 
        }
      );
      
      // Add design to user contributions
      await User.findByIdAndUpdate(
        req.user.id,
        { 
          $push: { 
            contributions: {
              design: designId,
              contributionWeight
            } 
          } 
        }
      );
    }
    
    res.status(201).json({
      success: true,
      data: evaluation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Update evaluation
exports.updateEvaluation = async (req, res) => {
  try {
    let evaluation = await Evaluation.findById(req.params.id);
    
    if (!evaluation) {
      return res.status(404).json({
        success: false,
        error: 'Evaluation not found'
      });
    }
    
    // Check if user is evaluation creator
    if (evaluation.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this evaluation'
      });
    }
    
    evaluation = await Evaluation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      data: evaluation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Delete evaluation
exports.deleteEvaluation = async (req, res) => {
  try {
    const evaluation = await Evaluation.findById(req.params.id);
    
    if (!evaluation) {
      return res.status(404).json({
        success: false,
        error: 'Evaluation not found'
      });
    }
    
    // Check if user is evaluation creator
    if (evaluation.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this evaluation'
      });
    }
    
    // Remove evaluation from design and user
    await Design.findByIdAndUpdate(
      evaluation.design,
      { $pull: { evaluations: evaluation._id } }
    );
    
    await User.findByIdAndUpdate(
      evaluation.user,
      { $pull: { evaluations: evaluation._id } }
    );
    
    // If this user made modifications, remove them as a contributor
    if (evaluation.modifications || evaluation.modifiedImageUrl || evaluation.modifiedDesignData) {
      await Design.findByIdAndUpdate(
        evaluation.design,
        { $pull: { contributors: { user: evaluation.user } } }
      );
      
      await User.findByIdAndUpdate(
        evaluation.user,
        { $pull: { contributions: { design: evaluation.design } } }
      );
    }
    
    await evaluation.remove();
    
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
