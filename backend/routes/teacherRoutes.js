const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const ctrl = require('../controllers/teacherController');

const router = express.Router();

router.get('/me/dashboard', protect, authorize('teacher'), ctrl.dashboard);
router.get('/', protect, authorize('admin', 'teacher'), ctrl.list);
router.get('/:id', protect, authorize('admin', 'teacher'), ctrl.getOne);
router.post('/', protect, authorize('admin'), ctrl.create);
router.put('/:id', protect, authorize('admin'), ctrl.update);
router.delete('/:id', protect, authorize('admin'), ctrl.remove);

module.exports = router;
