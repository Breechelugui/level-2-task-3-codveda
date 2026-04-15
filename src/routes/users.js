const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Create
router.post('/', async (req, res) => {
  const user = await User.create(req.body);
  res.status(201).json(user);
});

// Read all (with optional pagination)
router.get('/', async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const users = await User.find()
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .lean();
  res.json(users);
});

// Read one
router.get('/:id', async (req, res) => {
  const user = await User.findById(req.params.id).lean();
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
});

// Update
router.put('/:id', async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
});

// Delete
router.delete('/:id', async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ message: 'User deleted' });
});

module.exports = router;
