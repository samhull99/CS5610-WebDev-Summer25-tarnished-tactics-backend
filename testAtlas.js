// testAtlas.js - Test your Atlas connection
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_ATLAS_URI;

async function testAtlasConnection() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log("Successfully connected to MongoDB Atlas!");
    
    const db = client.db("tarnished-tactics");
    const collections = await db.listCollections().toArray();
    console.log("Available collections:", collections.map(c => c.name));
    
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged deployment successfully!");
    
  } catch (error) {
    console.error("Connection failed:", error);
  } finally {
    await client.close();
  }
}

testAtlasConnection();