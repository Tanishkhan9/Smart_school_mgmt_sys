const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const ctrl = require('../controllers/attendanceController');

const router = express.Router();

router.get('/', protect, authorize('admin', 'teacher'), ctrl.list);
router.get('/student/:studentId', protect, ctrl.forStudent);
router.post('/', protect, authorize('admin', 'teacher'), ctrl.bulkSave);
router.put('/:id', protect, authorize('admin', 'teacher'), ctrl.update);

module.exports = router;
