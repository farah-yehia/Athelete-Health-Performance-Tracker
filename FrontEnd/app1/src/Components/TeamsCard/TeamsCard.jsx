import React from "react";

const TeamsCard = ({
  name,
  number,
  weight = "N/A",
  height = "N/A",
  team,
  img,
  distance = "N/A",
}) => {
  return (
    <div className="card text-white fw-bold text-start bg-warning">
      <div className="card-image">
        <img
          src={img}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "https://via.placeholder.com/150x190.png?text=No+Image"; // Fallback image
          }}
          alt={`${name}'s profile`}
          className="card-img-top"
          style={{ width: "150px", height: "190px", marginTop: "10px" }}
        />
      </div>
      <div className="card-body">
        <h5 className="card-title">{name}</h5>
        <p className="card-text">
          <strong>Number:</strong> {number}
        </p>
        <p className="card-text">
          <strong>Weight:</strong> {weight}
        </p>
        <p className="card-text">
          <strong>Height:</strong> {height}
        </p>
        <p className="card-text">
          <strong>Team:</strong> {team}
        </p>
        <p className="card-text">
          <strong>Distance Covered:</strong> {distance} km
        </p>
      </div>
    </div>
  );
};

export default TeamsCard;
