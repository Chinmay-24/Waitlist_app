const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('mongo-sanitize');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
require('dotenv').config();

const app = express();

// ============================
// SECURITY MIDDLEWARE
// ============================

// Set security HTTP headers
app.use(helmet());

// Data sanitization against NoSQL injection
app.use(mongoSanitize());

// Prevent parameters pollution
app.use(hpp());

// Strict CORS configuration
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS || process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400 // 24 hours
};
app.use(cors(corsOptions));

// Rate limiting - General API
const generalLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false,  // Disable the `X-RateLimit-*` headers
  skip: (req) => req.ip === '::1' || req.ip === '127.0.0.1' // Skip rate limiting for localhost
});

// Rate limiting - Authentication endpoints (stricter)
const authLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_AUTH_WINDOW_MS) || 900000,
  max: parseInt(process.env.RATE_LIMIT_AUTH_MAX_REQUESTS) || 5,
  message: 'Too many login attempts, please try again later.',
  skipSuccessfulRequests: true // Don't count successful requests
});

// Apply general rate limiting
app.use('/api/', generalLimiter);

// Body parsing middleware with size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// MongoDB Connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/restaurant-booking');
    console.log('MongoDB connected:', conn.connection.host);
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    console.log('Continuing server startup without database connection...');
  }
};

connectDB();

// ============================
// ROUTES
// ============================

// Apply stricter rate limiting to auth routes
app.use('/api/auth', authLimiter);

app.use('/api/auth', require('./routes/auth'));
app.use('/api/restaurants', require('./routes/restaurants'));
app.use('/api/menu', require('./routes/menu'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/reviews', require('./routes/reviews'));

// Health check (public endpoint, but consider protecting in production)
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// ============================
// 404 HANDLER
// ============================
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Not found',
    path: process.env.NODE_ENV === 'development' ? req.path : undefined
  });
});

// ============================
// ERROR HANDLING MIDDLEWARE
// ============================
app.use((err, req, res, next) => {
  // Don't expose error details in production
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  console.error('Error:', {
    message: err.message,
    stack: isDevelopment ? err.stack : 'Stack trace hidden'
  });

  const status = err.status || err.statusCode || 500;
  const message = isDevelopment ? err.message : 'Something went wrong';

  res.status(status).json({
    error: message,
    ...(isDevelopment && { stack: err.stack })
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});
