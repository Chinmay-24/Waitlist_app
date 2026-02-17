const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const memoryDB = require('../memoryDB');

exports.register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    if (mongoose.connection.readyState === 1) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already registered' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ name, email, password: hashedPassword, phone });
      await user.save();
      return res.status(201).json({ message: 'User registered successfully' });
    }

    // Fallback to in-memory
    const existingUser = await memoryDB.findUserByEmail(email);
    if (existingUser) return res.status(400).json({ error: 'Email already registered' });
    const hashedPassword = await bcrypt.hash(password, 10);
    await memoryDB.createUser({ name, email, password: hashedPassword, phone });
    res.status(201).json({ message: 'User registered (in-memory) successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    if (mongoose.connection.readyState === 1) {
      const user = await User.findOne({ email });
      if (!user) return res.status(401).json({ error: 'Invalid email or password' });
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) return res.status(401).json({ error: 'Invalid email or password' });
      const token = jwt.sign({ userId: user._1d || user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
      return res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
    }

    const user = await memoryDB.findUserByEmail(email);
    if (!user) return res.status(401).json({ error: 'Invalid email or password' });
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ error: 'Invalid email or password' });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const user = await User.findById(req.userId).select('-password');
      if (!user) return res.status(404).json({ error: 'User not found' });
      return res.json(user);
    }

    const user = await memoryDB.findUserById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const { password, ...rest } = user;
    res.json(rest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addFavorite = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const user = await User.findById(req.userId);
      if (!user.favorites.includes(req.params.restaurantId)) {
        user.favorites.push(req.params.restaurantId);
        await user.save();
      }
      return res.json(user.favorites);
    }
    res.status(500).json({ error: 'Database not connected' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.removeFavorite = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const user = await User.findById(req.userId);
      user.favorites = user.favorites.filter(id => id.toString() !== req.params.restaurantId);
      await user.save();
      return res.json(user.favorites);
    }
    res.status(500).json({ error: 'Database not connected' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getFavorites = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const user = await User.findById(req.userId).populate('favorites');
      return res.json(user.favorites);
    }
    res.status(500).json({ error: 'Database not connected' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
