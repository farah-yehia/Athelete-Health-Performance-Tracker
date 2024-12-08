import React from "react";
const TeamsCard = ({
  name,
  id,
  gender,
  weight,
  height,
  age,
  team,
  role,
  image,
  healthMetrics,
  doctor,
  comments,
}) => {
    const { heartRate, distanceCovered, lastUpdated } = healthMetrics;
  return (
    <>
      <div className="card text-white fw-bold text-start bg-warning">
      <div>{name}</div>
      <div>{gender}</div>
      <div>{weight}</div>
      <div>{height}</div>
      <div>{age}</div>
      <div>{team}</div>
      <div>{role}</div>
      <div>Heart Rate: {heartRate}</div>
      <div>Distance Covered: {distanceCovered} km</div>
      <div>Last Updated: {new Date(lastUpdated).toLocaleString()}</div>
    </div>
    </>
  );
};

export default TeamsCard;
