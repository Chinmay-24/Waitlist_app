const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const memoryDB = require('../memoryDB');

// ============================
// INPUT VALIDATION HELPERS
// ============================
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const validatePassword = (password) => {
  // At least 8 characters, one uppercase, one number
  const re = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
  return re.test(password);
};

const sanitizeInput = (str) => {
  if (typeof str !== 'string') return str;
  return str.trim().slice(0, 200); // Limit length and trim
};

// ============================
// REGISTER ENDPOINT
// ============================
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ 
        error: 'Name, email, and password are required',
        code: 'MISSING_FIELDS'
      });
    }

    // Validate email format
    if (!validateEmail(email)) {
      return res.status(400).json({ 
        error: 'Invalid email format',
        code: 'INVALID_EMAIL'
      });
    }

    // Validate password strength
    if (!validatePassword(password)) {
      return res.status(400).json({ 
        error: 'Password must be at least 8 characters with uppercase letter and number',
        code: 'WEAK_PASSWORD'
      });
    }

    // Sanitize inputs
    const sanitizedName = sanitizeInput(name);
    const sanitizedEmail = sanitizeInput(email).toLowerCase();

    if (mongoose.connection.readyState === 1) {
      // Check if email already exists
      const existingUser = await User.findOne({ email: sanitizedEmail });
      if (existingUser) {
        return res.status(409).json({ 
          error: 'Email already registered',
          code: 'DUPLICATE_EMAIL'
        });
      }

      // Hash password with secure rounds
      const hashedPassword = await bcrypt.hash(password, parseInt(process.env.BCRYPT_ROUNDS) || 10);
      
      const user = new User({ 
        name: sanitizedName, 
        email: sanitizedEmail, 
        password: hashedPassword, 
        phone: phone || '',
        role: 'user' // Default role
      });
      
      await user.save();
      
      return res.status(201).json({ 
        message: 'User registered successfully',
        user: { id: user._id, name: user.name, email: user.email }
      });
    }

    // Fallback to in-memory
    const existingUser = await memoryDB.findUserByEmail(sanitizedEmail);
    if (existingUser) {
      return res.status(409).json({ 
        error: 'Email already registered',
        code: 'DUPLICATE_EMAIL'
      });
    }

    const hashedPassword = await bcrypt.hash(password, parseInt(process.env.BCRYPT_ROUNDS) || 10);
    const newUser = await memoryDB.createUser({ 
      name: sanitizedName, 
      email: sanitizedEmail, 
      password: hashedPassword, 
      phone: phone || '',
      role: 'user'
    });
    
    res.status(201).json({ 
      message: 'User registered successfully',
      user: { id: newUser._id, name: newUser.name, email: newUser.email }
    });
  } catch (error) {
    console.error('Registration error:', error.message);
    res.status(500).json({ 
      error: 'Registration failed',
      code: 'REGISTRATION_ERROR'
    });
  }
};

// ============================
// LOGIN ENDPOINT
// ============================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email and password are required',
        code: 'MISSING_CREDENTIALS'
      });
    }

    const sanitizedEmail = sanitizeInput(email).toLowerCase();

    if (mongoose.connection.readyState === 1) {
      const user = await User.findOne({ email: sanitizedEmail });
      
      if (!user) {
        return res.status(401).json({ 
          error: 'Invalid credentials',
          code: 'INVALID_CREDENTIALS'
        });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      if (!isPasswordValid) {
        return res.status(401).json({ 
          error: 'Invalid credentials',
          code: 'INVALID_CREDENTIALS'
        });
      }

      // Generate JWT with user role
      const token = jwt.sign(
        { 
          userId: user._id,
          email: user.email,
          role: user.role || 'user'
        }, 
        process.env.JWT_SECRET, 
        { expiresIn: process.env.JWT_EXPIRE || '7d' }
      );

      return res.json({ 
        token, 
        user: { 
          id: user._id, 
          name: user.name, 
          email: user.email,
          role: user.role
        } 
      });
    }

    const user = await memoryDB.findUserByEmail(sanitizedEmail);
    if (!user) {
      return res.status(401).json({ 
        error: 'Invalid credentials',
        code: 'INVALID_CREDENTIALS'
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        error: 'Invalid credentials',
        code: 'INVALID_CREDENTIALS'
      });
    }

    const token = jwt.sign(
      { 
        userId: user._id,
        email: user.email,
        role: user.role || 'user'
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    res.json({ 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email,
        role: user.role
      } 
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ 
      error: 'Login failed',
      code: 'LOGIN_ERROR'
    });
  }
};

// ============================
// GET PROFILE ENDPOINT
// ============================
exports.getProfile = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const user = await User.findById(req.userId).select('-password');
      if (!user) {
        return res.status(404).json({ 
          error: 'User not found',
          code: 'USER_NOT_FOUND'
        });
      }
      return res.json(user);
    }

    const user = await memoryDB.findUserById(req.userId);
    if (!user) {
      return res.status(404).json({ 
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }
    
    const { password, ...rest } = user;
    res.json(rest);
  } catch (error) {
    console.error('Get profile error:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch profile',
      code: 'PROFILE_ERROR'
    });
  }
};


// ============================
// FAVORITES ENDPOINTS
// ============================
exports.addFavorite = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    if (!restaurantId) {
      return res.status(400).json({ 
        error: 'Restaurant ID is required',
        code: 'MISSING_RESTAURANT_ID'
      });
    }

    if (mongoose.connection.readyState === 1) {
      const user = await User.findById(req.userId);
      if (!user) {
        return res.status(404).json({ 
          error: 'User not found',
          code: 'USER_NOT_FOUND'
        });
      }

      if (!user.favorites.includes(restaurantId)) {
        user.favorites.push(restaurantId);
        await user.save();
      }
      return res.json(user.favorites);
    }

    res.status(500).json({ 
      error: 'Operation failed',
      code: 'DB_ERROR'
    });
  } catch (error) {
    console.error('Add favorite error:', error.message);
    res.status(500).json({ 
      error: 'Failed to add favorite',
      code: 'FAVORITE_ERROR'
    });
  }
};

exports.removeFavorite = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    if (!restaurantId) {
      return res.status(400).json({ 
        error: 'Restaurant ID is required',
        code: 'MISSING_RESTAURANT_ID'
      });
    }

    if (mongoose.connection.readyState === 1) {
      const user = await User.findById(req.userId);
      if (!user) {
        return res.status(404).json({ 
          error: 'User not found',
          code: 'USER_NOT_FOUND'
        });
      }

      user.favorites = user.favorites.filter(id => id.toString() !== restaurantId);
      await user.save();
      return res.json(user.favorites);
    }

    res.status(500).json({ 
      error: 'Operation failed',
      code: 'DB_ERROR'
    });
  } catch (error) {
    console.error('Remove favorite error:', error.message);
    res.status(500).json({ 
      error: 'Failed to remove favorite',
      code: 'FAVORITE_ERROR'
    });
  }
};

exports.getFavorites = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const user = await User.findById(req.userId).populate('favorites');
      if (!user) {
        return res.status(404).json({ 
          error: 'User not found',
          code: 'USER_NOT_FOUND'
        });
      }
      return res.json(user.favorites || []);
    }

    res.status(500).json({ 
      error: 'Operation failed',
      code: 'DB_ERROR'
    });
  } catch (error) {
    console.error('Get favorites error:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch favorites',
      code: 'FAVORITE_ERROR'
    });
  }
};
