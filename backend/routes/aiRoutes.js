const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const auth = require('../middleware/auth');

// @route   POST /api/ai/generate
// @desc    Generate a design using AI
// @access  Private
router.post('/generate', auth, aiController.generateDesign);

// @route   POST /api/ai/evaluations/:designId
// @desc    Process evaluations and generate an improved design
// @access  Private
router.post('/evaluations/:designId', auth, aiController.processEvaluations);

// @route   POST /api/ai/object-detection
// @desc    Detect objects in an image
// @access  Private
router.post('/object-detection', auth, aiController.detectObjects);

// @route   POST /api/ai/render-texture
// @desc    Render texture on an object
// @access  Private
router.post('/render-texture', auth, aiController.renderTexture);

// @route   POST /api/ai/apply-to-model
// @desc    Apply design to 3D model
// @access  Private
router.post('/apply-to-model', auth, aiController.applyToModel);

// @route   POST /api/ai/extract-pattern
// @desc    Extract clothing pattern
// @access  Private
router.post('/extract-pattern', auth, aiController.extractPattern);

module.exports = router;
