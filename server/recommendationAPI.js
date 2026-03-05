const express = require("express");
const { spawn } = require("child_process");
const path = require("path");

const router = express.Router();

// POST endpoint to get personalized recommendations
router.post("/recommendations", async (req, res) => {
  try {
    const {
      location,
      roofArea,
      roofSlope,
      roofMaterial,
      dwellers,
      waterDemand,
      groundwaterDepth,
      budget,
      latitude,
      longitude,
    } = req.body;

    // Map roof slope to algorithm format
    const roofSlopeMap = {
      flat: "Flat",
      low: "Low Slope",
      steep: "Steep",
    };

    // Map roof material to algorithm format
    const roofMaterialMap = {
      concrete: "Concrete",
      tile: "Tile",
      metal: "Metal Sheet",
      asbestos: "Asbestos",
      other: "Other",
    };

    // Map groundwater depth to algorithm format
    const groundwaterMap = {
      shallow: "5 meters",
      medium: "15 meters",
      deep: "35 meters",
      unknown: "25 meters",
    };

    // Map budget to tariff (simplified mapping)
    const budgetToTariff = {
      low: 10,
      medium: 15,
      high: 20,
      premium: 25,
    };

    // Convert roof area from sq ft to sq m (1 sq ft = 0.0929 sq m)
    const roofAreaSqM = roofArea
      ? (parseFloat(roofArea) * 0.0929).toFixed(2)
      : "100";

    // Prepare input data for Python algorithm
    const algorithmInputs = {
      location: location || "Delhi, India",
      roof_type: roofSlopeMap[roofSlope] || "Flat",
      roof_material: roofMaterialMap[roofMaterial] || "Concrete",
      dwellers: dwellers || "4",
      soil_type: "Sandy", // Default assumption
      groundwater_level: groundwaterMap[groundwaterDepth] || "25 meters",
      roof_area: roofAreaSqM,
      current_volume: 0, // Default to 0 for new users
      rainfall: 8, // Default rainfall assumption
      tariff: budgetToTariff[budget] || 15,
    };

    // Execute the Python recommendation API
    const pythonScriptPath = path.join(
      __dirname,
      "..",
      "python models",
      "rooftop",
      "rkgit",
      "recommendation_api.py"
    );
    const pythonProcess = spawn("python", [pythonScriptPath], {
      cwd: path.join(__dirname, "..", "python models", "rooftop", "rkgit"),
    });

    let output = "";
    let error = "";

    // Send input data to Python script
    console.log("Sending data to Python script:", algorithmInputs);
    pythonProcess.stdin.write(JSON.stringify(algorithmInputs));
    pythonProcess.stdin.end();

    pythonProcess.stdout.on("data", (data) => {
      output += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      error += data.toString();
    });

    pythonProcess.on("close", (code) => {
      console.log("Python script finished with code:", code);
      console.log("Python output:", output);
      console.log("Python error:", error);

      if (code !== 0) {
        console.error("Python script error:", error);
        return res.status(500).json({
          error: "Failed to generate recommendations",
          details: error,
        });
      }

      try {
        const result = JSON.parse(output);
        console.log("Parsed result:", result);
        res.json({
          success: true,
          data: result,
          location: {
            name: location,
            latitude,
            longitude,
          },
        });
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        console.error("Output was:", output);
        res.status(500).json({
          error: "Failed to parse recommendations",
          details: parseError.message,
        });
      }
    });
  } catch (error) {
    console.error("Recommendation API error:", error);
    res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
});

// Fallback endpoint that provides basic recommendations without AI
router.post("/recommendations-simple", async (req, res) => {
  try {
    const {
      location,
      roofArea,
      roofSlope,
      roofMaterial,
      dwellers,
      waterDemand,
      groundwaterDepth,
      budget,
      latitude,
      longitude,
    } = req.body;

    // Basic calculations - convert from sq ft to sq m
    const roof_area = roofArea ? parseFloat(roofArea) * 0.0929 : 100;
    const rainfall = 8; // Default rainfall in mm
    const runoff_coefficient = 0.8; // For concrete roof
    const runoff_capacity = Math.round(
      roof_area * rainfall * runoff_coefficient * 10
    ); // Convert to liters

    const dwellers_count = parseInt(dwellers) || 4;
    const daily_demand = dwellers_count * 5; // 5L per person per day
    const water_last_days = Math.max(
      1,
      Math.floor(runoff_capacity / daily_demand)
    );

    const tariff =
      budget === "low"
        ? 10
        : budget === "medium"
        ? 15
        : budget === "high"
        ? 20
        : 25;
    const money_saved = Math.round((runoff_capacity / 1000) * tariff);

    const result = {
      feasibility: true,
      systemType: "Rooftop Rainwater Harvesting System",
      runoffCapacity: runoff_capacity,
      recommendedDimensions: {
        pit: "1m diameter x 1.5m depth",
        trench: "1m x 1m x 10m",
        shaft: "Based on site conditions",
      },
      costEstimation: {
        systemCost: 50000,
        rechargeCost: 20000,
        totalCost: 70000,
      },
      waterLastDays: water_last_days,
      futureHarvest: runoff_capacity,
      moneySaved: money_saved,
      dailyDemand: daily_demand,
      impact: `Based on your ${roof_area} sq.m roof area and ${dwellers_count} dwellers, you can collect approximately ${runoff_capacity} liters of water per rainfall event. This water will last for ${water_last_days} days, saving you ₹${money_saved} annually.`,
      benefits: [
        "Save money on water bills",
        "Reduce dependency on groundwater",
        "Increase water security",
        "Mitigate flood risks",
      ],
    };

    res.json({
      success: true,
      data: result,
      location: {
        name: location,
        latitude,
        longitude,
      },
    });
  } catch (error) {
    console.error("Simple recommendation API error:", error);
    res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
});

module.exports = router;
