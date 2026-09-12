const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const ctrl = require('../controllers/resultController');

const router = express.Router();

router.get('/', protect, authorize('admin', 'teacher'), ctrl.list);
router.get('/student/:studentId', protect, ctrl.listForStudent);
router.post('/', protect, authorize('admin', 'teacher'), ctrl.upsert);
router.put('/:id', protect, authorize('admin', 'teacher'), ctrl.update);
router.post('/publish', protect, authorize('admin', 'teacher'), ctrl.publishMany);

module.exports = router;
