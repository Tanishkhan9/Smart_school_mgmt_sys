const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const ctrl = require('../controllers/admissionController');

const router = express.Router();

router.post('/', ctrl.create);
router.get('/', protect, authorize('admin'), ctrl.list);
router.get('/:id', protect, authorize('admin'), ctrl.getOne);
router.put('/:id/status', protect, authorize('admin'), ctrl.updateStatus);

module.exports = router;
