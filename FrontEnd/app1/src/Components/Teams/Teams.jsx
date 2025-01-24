import React from "react";
import { Link } from "react-router-dom";
import "./Teams.css";


const Teams = () => {
  const teams = [
    { name: "Aston Villa", img: "../../../public/aston_villa.png.webp" },
    { name: "Man City", img: "../../../public/man_city.png" },
    { name: "Crystal Palace", img: "../../../public/crystal_palace.png" },
    { name: "Man Utd", img: "../../../public/man_utd.png" },
    { name: "Everton", img: "../../../public/everton.png" },
    { name: "Liverpool", img: "../../../public/liverpool.png" },
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
