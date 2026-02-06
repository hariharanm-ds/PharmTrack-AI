const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

router.get('/dummy-user', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash('password123', 10);

    const dummyUser = new User({
      name: 'Test User',
      email: 'testuser@example.com',
      password: hashedPassword
    });

    await dummyUser.save().catch(() => console.log('User may already exist'));

    const users = await User.find({});
    res.json({ success: true, count: users.length, users });

  } catch (error) {
    console.error('Test route error:', error);
    res.status(500).json({ success: false, message: 'Database test failed' });
  }
});

module.exports = router;
