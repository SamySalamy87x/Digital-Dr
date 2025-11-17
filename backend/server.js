const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000', 'http://localhost:19006'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Digital Dr Backend is running',
    timestamp: new Date().toISOString()
  });
});

// API version endpoint
app.get('/api/v1/status', (req, res) => {
  res.status(200).json({
    status: 'OK',
    version: '1.0.0',
    application: 'Digital Dr - Healthcare Management Platform',
    developer: 'Omar Rafael Pérez Gallardo',
    timestamp: new Date().toISOString()
  });
});

// TODO: Import and use routes
// const authRoutes = require('./routes/auth');
// const patientRoutes = require('./routes/patients');
// const appointmentRoutes = require('./routes/appointments');
// const gptRoutes = require('./routes/gpt');
// const paypalRoutes = require('./routes/paypal');
// Import route files
const authRoutes = require('./routes/auth');
const patientRoutes = require('./routes/patients');
const appointmentRoutes = require('./routes/appointments');
const medicalRecordRoutes = require('./routes/medical-records');
const gptRoutes = require('./routes/gpt');
const paypalRoutes = require('./routes/paypal');
const patientAuthRoutes = require('./routes/patients-auth');
const searchRoutes = require('./routes/search');
const availabilityRoutes = require('./routes/doctors-availability');
const notificationRoutes = require('./routes/notifications');
// app.use('/api/v1/auth', authRoutes);
// app.use('/api/v1/patients', patientRoutes);
// app.use('/api/v1/appointments', appointmentRoutes);
// app.use('/api/v1/gpt', gptRoutes);
// app.use('/api/v1/paypal', paypalRoutes);
// Use routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/patients', patientRoutes);
app.use('/api/v1/appointments', appointmentRoutes);
app.use('/api/v1/medical-records', medicalRecordRoutes);
app.use('/api/v1/gpt', gptRoutes);
app.use('/api/v1/subscriptions', paypalRoutes);
app.use('/api/v1/patients-auth', patientAuthRoutes);
app.use('/api/v1/search', searchRoutes);
app.use('/api/v1/availability', availabilityRoutes);
app.use('/api/v1/notifications', notificationRoutes);
// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found',
    path: req.path
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Digital Dr Backend server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Timestamp: ${new Date().toISOString()}`);
});

module.exports = app;
