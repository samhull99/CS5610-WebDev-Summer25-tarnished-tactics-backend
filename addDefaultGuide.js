// addDefaultGuide.js - Run this script to add a basic guide to your database

const defaultGuide = {
  userId: "admin_001", // Same admin user as the build
  title: "Basic Combat Guide",
  description: "The fundamental strategy that will get you through most of Elden Ring",
  content: "Dodge and hit.",
  category: "Combat Guide",
  difficulty: "Beginner",
  associatedBuilds: [], // No associated builds for now
  recommendedLevel: 1,
  tags: ["combat", "basics", "beginner"],
  images: [], // No images
  isPublic: true // Make it visible to everyone
};

// Function to add the guide
async function addDefaultGuide() {
  try {
    const response = await fetch('http://localhost:5000/api/v1/guides', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(defaultGuide)
    });

    if (response.ok) {
      const result = await response.json();
      console.log('Default guide added successfully!');
      console.log('Guide ID:', result.id);
    } else {
      const error = await response.json();
      console.error('Error adding guide:', error);
    }
  } catch (error) {
    console.error('Network error:', error);
  }
}

addDefaultGuide();