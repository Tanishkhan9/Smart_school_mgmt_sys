const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { upload } = require('../middleware/uploadMiddleware');
const ctrl = require('../controllers/assignmentController');

const router = express.Router();

router.get('/', protect, ctrl.list);
router.post('/', protect, authorize('admin', 'teacher'), upload.single('attachment'), ctrl.create);
router.put('/:id', protect, authorize('admin', 'teacher'), upload.single('attachment'), ctrl.update);
router.delete('/:id', protect, authorize('admin', 'teacher'), ctrl.remove);
router.post('/:id/submit', protect, authorize('student'), upload.single('file'), ctrl.submit);
router.get('/:id/submissions', protect, authorize('admin', 'teacher'), ctrl.submissions);

module.exports = router;
