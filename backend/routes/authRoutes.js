const express = require('express');
const rateLimit = require('express-rate-limit');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const auth = require('../controllers/authController');

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  message: { success: false, message: 'Too many login attempts. Try again later.' },
});

router.post('/register', auth.register);
router.post('/login', loginLimiter, auth.login);
router.post('/logout', auth.logout);
router.get('/me', protect, auth.me);

module.exports = router;
