const axios = require("axios");

// Test data matching Profile.jsx form structure
const testData = {
  address: "123 Test Street, Delhi, India",
  roofArea: "1000", // sq ft
  roofSlope: "flat",
  roofMaterial: "concrete",
  openSpace: "500",
  dwellers: "4",
  waterDemand: "200",
  groundwaterDepth: "medium",
  budget: "medium",
  latitude: 28.6139,
  longitude: 77.209,
};

async function testRecommendations() {
  console.log("Testing recommendation API endpoints...\n");

  try {
    // Test simple recommendations first
    console.log("1. Testing /api/recommendations-simple...");
    const simpleResponse = await axios.post(
      "http://localhost:3001/api/recommendations-simple",
      testData
    );
    console.log("✅ Simple recommendations successful");
    console.log("Response:", JSON.stringify(simpleResponse.data, null, 2));
    console.log("\n");
  } catch (error) {
    console.log("❌ Simple recommendations failed:", error.message);
    if (error.response) {
      console.log("Error details:", error.response.data);
    }
    console.log("\n");
  }

  try {
    // Test AI-powered recommendations
    console.log("2. Testing /api/recommendations (AI-powered)...");
    const aiResponse = await axios.post(
      "http://localhost:3001/api/recommendations",
      testData
    );
    console.log("✅ AI recommendations successful");
    console.log("Response:", JSON.stringify(aiResponse.data, null, 2));
  } catch (error) {
    console.log("❌ AI recommendations failed:", error.message);
    if (error.response) {
      console.log("Error details:", error.response.data);
    }
  }
}

// Run the test
testRecommendations().catch(console.error);

