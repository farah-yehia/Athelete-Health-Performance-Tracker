const express = require("express");
const router = express.Router();
const { Player } = require("../db/Database");

// Fetch players by team
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

// Fetch player by ID
router.get("/api/player/:id", async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) return res.status(404).json({ error: "Player not found" });

    res.status(200).json({
      name: player.name,
      weight: player.weight,
      BMI: player.BMI,
      heartRate: player.heartRate,
      MheartRate: player.MheartRate,
      distance: player.distance,
      maxPlayTime: player.maxPlayTime,
    });
  } catch (error) {
    console.error("Error fetching player:", error.message);
    res.status(500).json({ error: "Failed to fetch player" });
  }
});

module.exports = router;
