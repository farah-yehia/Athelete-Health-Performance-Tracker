import React from "react";

const TeamsCard = ({
  name,
  age,
  weight_kg = (Math.random() * (100 - 50) + 50).toFixed(1), // 50–100 kg
  calories = Math.floor(Math.random() * (10000 - 100 + 1)) + 100, // 100–10000 kcal
  img,
  onClick,
}) => {
  return (
    <div
      className="card text-white fw-bold text-start bg-warning"
      onClick={onClick}
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
          <strong>Age:</strong>{" "}
          {age >= 20 && age <= 30
            ? age
            : Math.floor(Math.random() * (30 - 20 + 1)) + 20}
        </p>

        <p className="card-text">
          <strong>Weight:</strong> {weight_kg} kg
        </p>
        <p className="card-text">
          <strong>Calories:</strong> {calories} kcal
        </p>
      </div>
    </div>
  );
};

export default TeamsCard;
