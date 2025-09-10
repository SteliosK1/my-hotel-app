const express = require('express');
const cors = require('cors');
const hotelRoutes = require('./routes/hotels');
const roomRoutes = require('./routes/rooms');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware - Allow all CORS requests
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: false
}));
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Simple Hotel API', 
    version: '1.0.0',
    endpoints: {
      hotels: '/api/hotels',
      rooms: '/api/rooms'
    }
  });
});

app.use('/api/hotels', hotelRoutes);
app.use('/api/rooms', roomRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    success: false 
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    success: false 
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 API endpoints available at http://localhost:${PORT}/api/hotels`);
});
