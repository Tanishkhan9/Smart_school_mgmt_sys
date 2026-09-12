const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const ctrl = require('../controllers/examinationController');

const router = express.Router();

router.get('/', protect, ctrl.list);
router.get('/:id', protect, ctrl.getOne);
router.post('/', protect, authorize('admin', 'teacher'), ctrl.create);
router.put('/:id', protect, authorize('admin', 'teacher'), ctrl.update);
router.delete('/:id', protect, authorize('admin'), ctrl.remove);

module.exports = router;
