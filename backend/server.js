// Experiment 1: Demonstrate the Use of Node.js
// Experiment 2: Implementation of Express.js
require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const gameRoutes = require('./routes/gameRoutes');
const orderRoutes = require('./routes/orderRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const cartRoutes = require('./routes/cartRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Vite dev server
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Experiment 1: Basic Node.js HTTP response
app.get('/', (req, res) => {
  res.json({
    message: 'Game Store API is running',
    version: '1.0.0',
    experiments: [
      'Exp 1: Node.js server running',
      'Exp 2: Express.js routing & middleware',
      'Exp 3: MongoDB connected via Mongoose',
      'Exp 4: RESTful APIs available',
    ],
  });
});

// Experiment 4: RESTful API Routes
app.use('/api/auth', authRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/users', userRoutes);

// Error Handling Middleware (Experiment 2)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });
});
