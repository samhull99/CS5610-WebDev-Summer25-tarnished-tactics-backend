// addDefaultBuild.js - Run this script to add a default build to your database

const defaultBuild = {
  userId: "admin_001", // Default admin user ID
  name: "Starter Build",
  description: "A basic starting build for new players. Balanced stats with placeholder equipment to get you started in the Lands Between.",
  class: "Wretch", // Starting class with all stats at 10
  level: 1,
  stats: {
    vigor: 10,
    mind: 10,
    endurance: 10,
    strength: 10,
    dexterity: 10,
    intelligence: 10,
    faith: 10,
    arcane: 10
  },
  equipment: {
    rightHand: ["Club"], // Basic starting weapon
    leftHand: [], // Nothing in left hand
    armor: {
      helmet: "Commoner's Headband",
      chest: "Commoner's Garb", 
      gauntlets: "Commoner's Bracers",
      legs: "Commoner's Trousers"
    },
    talismans: [] // No talismans equipped
  },
  spells: [], // No spells
  isPublic: true, // Make it visible to everyone
  isPreset: true, // Mark as a preset build
  tags: ["beginner", "starter", "balanced"]
};

// Function to add the build
async function addDefaultBuild() {
  try {
    const response = await fetch('http://localhost:5000/api/v1/builds', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(defaultBuild)
    });

    if (response.ok) {
      const result = await response.json();
      console.log('Default build added successfully!');
      console.log('Build ID:', result.id);
    } else {
      const error = await response.json();
      console.error('Error adding build:', error);
    }
  } catch (error) {
    console.error('Network error:', error);
  }
}

// Run the function
addDefaultBuild();