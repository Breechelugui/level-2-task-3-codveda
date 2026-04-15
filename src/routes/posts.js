const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// Create
router.post('/', async (req, res) => {
  const post = await Post.create(req.body);
  res.status(201).json(post);
});

// Read all — supports ?search=keyword and ?author=id
router.get('/', async (req, res) => {
  const { search, author, page = 1, limit = 10 } = req.query;
  const query = {};
  if (author) query.author = author;
  if (search) query.$text = { $search: search };

  const posts = await Post.find(query)
    .populate('author', 'name email')
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .lean();
  res.json(posts);
});

// Read one
router.get('/:id', async (req, res) => {
  const post = await Post.findById(req.params.id).populate('author', 'name email').lean();
  if (!post) return res.status(404).json({ message: 'Post not found' });
  res.json(post);
});

// Update
router.put('/:id', async (req, res) => {
  const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!post) return res.status(404).json({ message: 'Post not found' });
  res.json(post);
});

// Delete
router.delete('/:id', async (req, res) => {
  const post = await Post.findByIdAndDelete(req.params.id);
  if (!post) return res.status(404).json({ message: 'Post not found' });
  res.json({ message: 'Post deleted' });
});

module.exports = router;
