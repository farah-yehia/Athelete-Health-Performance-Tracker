const express = require("express");
const router = express.Router();
const { Player } = require("../db/Database");
const axios = require("axios");



// ✅ Fetch players by team
router.get("/api/teams", async (req, res) => {
  try {
    const { team, limit = 10, page = 1 } = req.query;

    if (!team) {
      return res
        .status(400)
        .json({ error: "Please provide a valid team name in the query." });
    }

    const players = await Player.find({ team })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    if (players.length === 0) {
      return res
        .status(404)
        .json({ error: `No players found for the team: ${team}` });
    }

    res.status(200).json({ team, players });
  } catch (error) {
    console.error("Error fetching players by team:", error.message);
    res.status(500).json({ error: "Failed to fetch player data." });
  }
});

// ✅ Fetch player by ID (for modal in frontend)
router.get("/api/player/:id", async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) {
      return res.status(404).json({ error: "Player not found" });
    }

    res.status(200).json({
      name: player.name,
      age: player.age,
      weight: player.weight_kg,
      bmi: player.bmi,
      heartRate: player.heartRate,
      MheartRate: player.MheartRate,
      distance: player.distance,
      vo2_max: player.vo2_max,
      calories: player.calories,
      steps: player.steps,
      maxPlayTime: player.maxPlayTime,
      lastUpdated: player.lastUpdated,
    });
  } catch (error) {
    console.error("Error fetching player:", error.message);
    res.status(500).json({ error: "Failed to fetch player" });
  }
});

// Trigger AI model 
router.post("/player/:id/post-match-analysis", async (req, res) => {
  const playerId = req.params.id;

  try {
    const player = await Player.findById(playerId);
    if (!player) return res.status(404).json({ error: "Player not found" });

    const inputData = {
      _id: playerId, 
      avg_heart_rate: player.avg_heart_rate || 0,
      distance: player.distance || 0,
      duration_minutes: player.duration_minutes || 0,
      intensity: player.intensity || "medium",
      age: player.age || 20,
      vo2_max: player.vo2_max || 30,
      weight_kg: player.weight_kg || 70,
      bmi: player.bmi || 22,
      calories: player.calories || 0,
      steps: player.steps || 0,
    };
    console.log("Sending to Flask model:", inputData);
    await axios.post("http://44.203.148.137:5001/predict-maxplay", inputData);
    res.status(204).send(); 
  } catch (err) {
    console.error("Post-match AI error:", err.message);
    res.status(500).json({ error: "AI trigger failed" });
  }
});


module.exports = router;
