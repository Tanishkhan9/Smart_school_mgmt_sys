const express = require('express');
const { protect, optionalAuth } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const ctrl = require('../controllers/noticeController');

const router = express.Router();

router.get('/', optionalAuth, ctrl.list);
router.post('/', protect, authorize('admin', 'teacher'), ctrl.create);
router.put('/:id', protect, authorize('admin', 'teacher'), ctrl.update);
router.delete('/:id', protect, authorize('admin', 'teacher'), ctrl.remove);

module.exports = router;
