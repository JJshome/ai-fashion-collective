const express = require('express');
const router = express.Router();
const evaluationController = require('../controllers/evaluationController');
const auth = require('../middleware/auth');

// @route   GET /api/evaluations
// @desc    Get all evaluations
// @access  Public
router.get('/', evaluationController.getEvaluations);

// @route   GET /api/evaluations/design/:designId
// @desc    Get evaluations for a specific design
// @access  Public
router.get('/design/:designId', evaluationController.getDesignEvaluations);

// @route   GET /api/evaluations/user/:userId
// @desc    Get evaluations by a specific user
// @access  Public
router.get('/user/:userId', evaluationController.getUserEvaluations);

// @route   POST /api/evaluations
// @desc    Create evaluation
// @access  Private
router.post('/', auth, evaluationController.createEvaluation);

// @route   PUT /api/evaluations/:id
// @desc    Update evaluation
// @access  Private
router.put('/:id', auth, evaluationController.updateEvaluation);

// @route   DELETE /api/evaluations/:id
// @desc    Delete evaluation
// @access  Private
router.delete('/:id', auth, evaluationController.deleteEvaluation);

module.exports = router;
