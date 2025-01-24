const express = require("express");
const router = express.Router();
const { Player } = require("../db/Database");

router.get("/api/teams", async (req, res) => {
  try {
    const { team, limit = 10, page = 1 } = req.query; // Get team parameter from query

    if (!team) {
      return res
        .status(400)
        .json({ error: "Please provide a valid team name in the query." });
    }

    // Fetch players for the specified team
    const players = await Player.find({ team })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    // If no players found for the team, return an appropriate response
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


module.exports = router;
