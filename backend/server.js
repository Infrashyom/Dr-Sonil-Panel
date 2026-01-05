
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './src/config/db.js';
import apiRoutes from './src/routes/apiRoutes.js';

// Config
dotenv.config();
connectDB();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
// INCREASED LIMIT for uncompressed images as requested
app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

// Routes
app.use('/api', apiRoutes);

// Serve Static Assets (Frontend)
// This points to the dist folder in the root directory
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

// Catch-all route to serve index.html for client-side routing
// This must be after API routes
app.get('*', (req, res) => {
  res.sendFile(path.resolve(distPath, 'index.html'));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
