import React from "react";
import TeamsCard from "../TeamsCard/TeamsCard";
import "./Teams.css";

const Teams = ({ data }) => {
  return (
    <div className="teams-container">
      <div className="oneCard">
        {data && data.length > 0 ? (
          data.map((team) => <TeamsCard key={team.id} {...team} />)
        ) : (
          <p className="no-teams-message">No teams available at the moment.</p>
        )}
      </div>
    </div>
  );
};

export default Teams;
