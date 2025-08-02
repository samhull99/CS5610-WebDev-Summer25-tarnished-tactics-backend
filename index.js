import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import app from './server.js';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;

// MongoDB connection
let db;
MongoClient.connect(process.env.MONGODB_URI, {
  useUnifiedTopology: true,
})
.then(client => {
  console.log('Connected to MongoDB');
  db = client.db('tarnished-tactics');
})
.catch(error => console.error('MongoDB connection error:', error));

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Visit: http://localhost:${PORT}`);
});

// Export db for use in routes
export { db };