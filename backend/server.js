import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './src/config/db.js';
import apiRoutes from './src/routes/apiRoutes.js';

// Config
dotenv.config();
connectDB();

const app = express();

// Middleware
// INCREASED LIMIT for uncompressed images as requested
app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

// Routes
app.use('/api', apiRoutes);

// Root
app.get('/', (req, res) => {
  res.send('Dr. Sonil Backend API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});