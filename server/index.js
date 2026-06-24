const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const authRoutes = require(path.join(__dirname, 'routes', 'auth.js'));
const contentRoutes = require(path.join(__dirname, 'routes', 'content.js'));
const userRoutes = require(path.join(__dirname, 'routes', 'users.js'));
const taxonomyRoutes = require(path.join(__dirname, 'routes', 'taxonomy.js'));

const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy (required for rate limiting behind reverse proxy like nginx)
app.set('trust proxy', 1);

// CORS Configuration - Allow all origins
const corsOptions = {
  origin: '*', // Allow all origins
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
};

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files
app.use('/uploads', express.static('uploads'));

// Let's Encrypt ACME Challenge - serve from .well-known directory
// This allows Let's Encrypt to verify domain ownership
app.use('/.well-known/acme-challenge', express.static(path.join(__dirname, '.well-known', 'acme-challenge')));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 100 : 1000, // Higher limit for development
  message: {
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/taxonomy', taxonomyRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lich-su-so')
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  }); 