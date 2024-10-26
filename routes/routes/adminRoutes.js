const { protect } = require('../middleware/authMiddleware');

// Protect admin dashboard route
router.get('/dashboard', protect, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied, admin only' });
    }

    // Send dashboard data
    res.json({ message: 'Welcome to the Admin Dashboard' });
});
