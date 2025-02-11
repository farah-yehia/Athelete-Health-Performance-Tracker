import React from "react";

const TeamsCard = ({
  name,
  number,
  weight = "N/A",
  height = "N/A",
  team,
  img,
  distance = "N/A",
  age,
  heartRate,
  lastUpdated,
}) => {
  return (
    <div className="card text-white fw-bold text-start bg-warning">
      {/* Player Image */}
      <div className="card-image">
        <img
          src={img}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "https://via.placeholder.com/150x190.png?text=No+Image"; 
          }}
          alt={`${name}'s profile`}
          className="card-img-top"
          style={{ width: "150px", height: "190px", marginTop: "10px" }}
        />
      </div>

      {/* Player Information */}
      <div className="card-body">
        <h5 className="card-title">{name || "Unnamed Player"}</h5>
        <p className="card-text">
          <strong>Number:</strong> {number || "N/A"}
        </p>
        <p className="card-text">
          <strong>Weight:</strong> {weight}
        </p>
        <p className="card-text">
          <strong>Height:</strong> {height}
        </p>
        {/* <p className="card-text">
          <strong>Team:</strong> {team || "Unknown Team"}
        </p> */}
        <p className="card-text">
          <strong>Distance Covered:</strong> {distance} km
        </p>
        <p className="card-text">
          <strong>Age:</strong> {age}
        </p>
        <p className="card-text">
          <strong>Heart Rate:</strong> {heartRate}
        </p>
        <p className="card-text">
          <strong>Last Updated:</strong> {lastUpdated}
        </p>
      </div>
    </div>
  );
};

export default TeamsCard;
