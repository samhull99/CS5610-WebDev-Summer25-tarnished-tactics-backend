import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import BuildsDAO from './dao/buildsDAO.js';
import GuidesDAO from './dao/guidesDAO.js';
import buildsRouter from './api/builds.route.js';
import guidesRouter from './api/guides.route.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
let db;
MongoClient.connect(process.env.MONGODB_URI)
.then(async client => {
  console.log('Connected to MongoDB');
  db = client.db('tarnished-tactics');
  
  // Initialize DAOs
  await BuildsDAO.injectDB(client);
  await GuidesDAO.injectDB(client);
  console.log('DAOs initialized successfully');
})
.catch(error => console.error('MongoDB connection error:', error));

// Basic route
app.get('/', (req, res) => {
    res.json({ 
        message: 'Tarnished Tactics API is running!',
        version: '1.0',
        endpoints: {
            builds: '/api/v1/builds',
            guides: '/api/v1/guides'
        }
    });
});

// API Routes
app.use('/api/v1/builds', buildsRouter);
app.use('/api/v1/guides', guidesRouter);

export { db, BuildsDAO, GuidesDAO };

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Visit: http://localhost:${PORT}`);
    console.log('MongoDB connection will be established...');
});