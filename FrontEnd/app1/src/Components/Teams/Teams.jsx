import React from "react";
import { Link } from "react-router-dom";
import "./Teams.css";


const Teams = () => {
  const teams = [
    { name: "Aston Villa", img: "aston_villa.png.webp" },
    { name: "Man City", img: "man_city.png" },
    { name: "Crystal Palace", img: "crystal_palace.png" },
    { name: "Man Utd", img: "man_utd.png" },
    { name: "Everton", img: "everton.png" },
    { name: "Liverpool", img: "liverpool.png" },
  ]; // Example teams with images

  return (
    <div className="teams-container">
      {teams.map((team) => (
        <div key={team.name} className="team-card">
          <img src={team.img} alt={`${team.name} logo`} className="team-logo" />
          <h2>{team.name}</h2>
          <Link to={`/teams/${team.name}`} className="view-team-details-button">
            View {team.name} Players
          </Link>
        </div>
      ))}
    </div>
  );
};

export default Teams;
