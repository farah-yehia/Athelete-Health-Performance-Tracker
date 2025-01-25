import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import TeamsCard from "../TeamsCard/TeamsCard";
import { Back_Origin } from "../../Front_ENV";
import "./TeamDetails.css";

const TeamDetails = () => {
  const { team } = useParams();
  const [loading, setLoading] = useState(false);
  const [players, setPlayers] = useState([]);
  const [error, setError] = useState("");

  // Fetch players for the team
  const fetchTeamPlayers = async (teamName) => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        `${Back_Origin}/api/teams?team=${encodeURIComponent(teamName)}`
      );
      setPlayers(response.data?.players || []); // Use response structure
    } catch (err) {
      console.error("Error fetching players:", err);
      setError("Failed to load players for this team. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamPlayers(team);
  }, [team]);

  return (
    <div className="team-details-container">
      <h2>
        Players of <span> {team}</span>
      </h2>
      {loading && <p>Loading players...</p>}
      {error && <p className="error-message">{error}</p>}
      <div className="players-list">
        {players.length > 0
          ? players.map((onePlayer, index) => (
              <TeamsCard
                key={onePlayer.id || `${onePlayer.name}-${index}`} // Ensure a unique key
                {...onePlayer}
              />
            ))
          : !loading && <p>No players available for {team}.</p>}
      </div>
    </div>
  );

};

export default TeamDetails;
