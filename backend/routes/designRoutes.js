const express = require('express');
const router = express.Router();
const designController = require('../controllers/designController');
const auth = require('../middleware/auth');

// @route   GET /api/designs
// @desc    Get all designs
// @access  Public
router.get('/', designController.getDesigns);

// @route   GET /api/designs/:id
// @desc    Get single design
// @access  Public
router.get('/:id', designController.getDesign);

// @route   POST /api/designs
// @desc    Create new design
// @access  Private
router.post('/', auth, designController.createDesign);

// @route   PUT /api/designs/:id
// @desc    Update design
// @access  Private
router.put('/:id', auth, designController.updateDesign);

// @route   DELETE /api/designs/:id
// @desc    Delete design
// @access  Private
router.delete('/:id', auth, designController.deleteDesign);

// @route   GET /api/designs/ai/generated
// @desc    Get AI-generated designs
// @access  Public
router.get('/ai/generated', designController.getAIDesigns);

// @route   GET /api/designs/user/:userId
// @desc    Get designs by creator
// @access  Public
router.get('/user/:userId', designController.getDesignsByCreator);

module.exports = router;
