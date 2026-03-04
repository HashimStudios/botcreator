const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { requireGuest, requireAuth } = require('../middleware/auth');

// Register
router.post('/register', requireGuest, async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;
    if (!username || !email || !password) return res.json({ error: 'All fields required' });
    if (password !== confirmPassword) return res.json({ error: 'Passwords do not match' });
    if (password.length < 6) return res.json({ error: 'Password must be at least 6 characters' });
    if (username.length < 3) return res.json({ error: 'Username must be at least 3 characters' });

    const existingEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingEmail) return res.json({ error: 'Email already registered' });

    const existingUser = await User.findOne({ username: { $regex: new RegExp(`^${username}$`, 'i') } });
    if (existingUser) return res.json({ error: 'Username already taken' });

    const user = await User.create({ username, email, password });
    req.session.userId = user._id;
    req.session.username = user.username;
    res.json({ success: true, redirect: '/dashboard' });
  } catch (err) {
    console.error(err);
    res.json({ error: 'Registration failed. Try again.' });
  }
});

// Login
router.post('/login', requireGuest, async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.json({ error: 'Email and password required' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.json({ error: 'Invalid credentials' });

    const match = await user.comparePassword(password);
    if (!match) return res.json({ error: 'Invalid credentials' });

    user.lastLogin = new Date();
    await user.save();

    req.session.userId = user._id;
    req.session.username = user.username;
    res.json({ success: true, redirect: '/dashboard' });
  } catch (err) {
    console.error(err);
    res.json({ error: 'Login failed. Try again.' });
  }
});

// Logout
router.post('/logout', requireAuth, (req, res) => {
  req.session.destroy(() => res.json({ success: true, redirect: '/' }));
});

module.exports = router;
