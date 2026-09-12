const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const ctrl = require('../controllers/adminController');

const router = express.Router();

router.get('/dashboard', protect, authorize('admin'), ctrl.dashboard);

module.exports = router;
