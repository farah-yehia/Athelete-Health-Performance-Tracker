import React from "react";

const TeamsCard = ({
  name,
  weight = (Math.random() * (100 - 50) + 50).toFixed(1), // Random weight (50-100 kg)
  BMI = (Math.random() * (30 - 18) + 18).toFixed(1), // Random BMI (18-30)
  img,
  distance = (Math.random() * (15 - 1) + 1).toFixed(2), // Random distance (1-15 km)
  age = Math.floor(Math.random() * 20) + 20, // Random age (20-39)
  heartRate = "Updating...",
  MheartRate = "Updating...",
  onClick
}) => {
  return (
    <div
      className="card text-white fw-bold text-start bg-warning"
      onClick={() => onClick && onClick(id)}
      style={{ cursor: "pointer" }}
    >
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
      <div className="card-body">
        <h5 className="card-title">{name || "Unnamed Player"}</h5>
        <p className="card-text">
          <strong>Weight:</strong> {weight} kg
        </p>
        <p className="card-text">
          <strong>BMI:</strong> {BMI}
        </p>
        <p className="card-text">
          <strong>Distance:</strong> {distance} km
        </p>
        <p className="card-text">
          <strong>AI Heart Rate:</strong> {heartRate} bpm
        </p>
        <p className="card-text">
          <strong>Machine Heart Rate:</strong> {MheartRate} bpm
        </p>
      </div>
    </div>
  );
};

export default TeamsCard;