const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Define routes (to be implemented)
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/customers', require('./routes/customer.routes'));
app.use('/api/contracts', require('./routes/contract.routes'));
app.use('/api/trading', require('./routes/trading.routes'));
app.use('/api/energy-data', require('./routes/energyData.routes'));
app.use('/api/risk-management', require('./routes/riskManagement.routes'));
app.use('/api/energy-services', require('./routes/energyServices.routes'));
app.use('/api/finance', require('./routes/finance.routes'));
app.use('/api/operations', require('./routes/operations.routes'));

// Default route
app.get('/', (req, res) => {
  res.json({ message: '售电公司业务中台 API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app; 