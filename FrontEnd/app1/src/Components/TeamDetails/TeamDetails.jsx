import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import TeamsCard from "../TeamsCard/TeamsCard";
import { Back_Origin } from "../../Front_ENV";
import { Info, Download } from "lucide-react";
import "./TeamDetails.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const TeamDetails = () => {
  const { team } = useParams();
  const [loading, setLoading] = useState(false);
  const [players, setPlayers] = useState([]);
  const [error, setError] = useState("");
  const [selectedPlayerId, setSelectedPlayerId] = useState(null);
  const [selectedPlayerStatic, setSelectedPlayerStatic] = useState(null);
  const [selectedPlayerLive, setSelectedPlayerLive] = useState(null);
  const [hrHistory, setHrHistory] = useState([]);
  const [alert, setAlert] = useState("");
  const [fullscreenChart, setFullscreenChart] = useState(false);

  const fetchTeamPlayers = async (teamName) => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        `${Back_Origin}/api/teams?team=${encodeURIComponent(teamName)}`
      );
      setPlayers(response.data?.players || []);
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

  useEffect(() => {
    if (!selectedPlayerId) return;

    const fetchPlayer = async () => {
      try {
        const { data } = await axios.get(
          `${Back_Origin}/api/player/${selectedPlayerId}`
        );

        if (!selectedPlayerStatic) {
          const { name, weight, BMI, maxPlayTime } = data;
          setSelectedPlayerStatic({ name, weight, BMI, maxPlayTime });
        }

        const { heartRate, MheartRate, distance } = data;
        setSelectedPlayerLive({ heartRate, MheartRate, distance });

        setHrHistory((prev) => [
          ...prev.slice(-9),
          {
            time: new Date().toLocaleTimeString(),
            ai: heartRate,
            hw: MheartRate,
          },
        ]);

        if (heartRate > 180 || MheartRate > 180) {
          setAlert("⚠️ Heart rate exceeded safe threshold!");
        } else {
          setAlert("");
        }
      } catch (err) {
        console.error("Failed to load player", err);
        setSelectedPlayerStatic(null);
        setSelectedPlayerLive(null);
      }
    };

    fetchPlayer();
    const interval = setInterval(fetchPlayer, 5000);
    return () => clearInterval(interval);
  }, [selectedPlayerId]);

  const handleInfoClick = (id) => {
    setSelectedPlayerId(id);
  };

  const closeModal = () => {
    setSelectedPlayerId(null);
    setSelectedPlayerStatic(null);
    setSelectedPlayerLive(null);
    setHrHistory([]);
    setAlert("");
    setFullscreenChart(false);
  };

  const downloadCSV = () => {
    const csv = ["Time,AI Heart Rate,HW Heart Rate"]
      .concat(hrHistory.map((d) => `${d.time},${d.ai},${d.hw}`))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `heart_rate_${selectedPlayerStatic?.name || "player"}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="team-details-container">
      <h2>
        Players of <span>{team}</span>
      </h2>

      {loading && <p>Loading players...</p>}
      {error && <p className="error-message">{error}</p>}

      <div className="players-list">
        {players.length > 0
          ? players.map((player, index) => (
              <div
                key={player._id || `${player.name}-${index}`}
                className="card-container"
              >
                <TeamsCard {...player} id={player._id} />
                <button
                  className="info-icon"
                  title="View Real-Time Data"
                  onClick={() => handleInfoClick(player._id)}
                >
                  <Info size={20} color="white" />
                </button>
              </div>
            ))
          : !loading && <p>No players available for {team}.</p>}
      </div>

      {selectedPlayerId && (
        <div className="modern-modal-overlay">
          <div className="modern-modal">
            <button className="close-btn" onClick={closeModal}>
              &times;
            </button>

            {!selectedPlayerLive || !selectedPlayerStatic ? (
              <div className="spinner"></div>
            ) : (
              <>
                <h2 className="modal-title">
                  {selectedPlayerStatic.name}
                  <span className="live-badge">🟠 LIVE</span>
                </h2>

                {alert && <div className="alert-box">{alert}</div>}

                <div className="metrics-grid">
                  <div className="metric-card ai pulse">
                    <h4>AI Heart Rate</h4>
                    <p>{selectedPlayerLive.heartRate} bpm</p>
                  </div>
                  <div className="metric-card hardware pulse">
                    <h4>Actual Heart Rate</h4>
                    <p>{selectedPlayerLive.MheartRate} bpm</p>
                  </div>
                  <div className="metric-card">
                    <h4>Distance</h4>
                    <p>{selectedPlayerLive.distance} km</p>
                  </div>
                  {selectedPlayerStatic.maxPlayTime && (
                    <div className="metric-card max-time">
                      <h4>Predicted Max Play Time</h4>
                      <p>{selectedPlayerStatic.maxPlayTime} mins</p>
                    </div>
                  )}
                </div>

                <div className="chart-controls">
                  <button
                    className="btn enhanced-btn"
                    onClick={() => setFullscreenChart(!fullscreenChart)}
                  >
                    {fullscreenChart ? "Exit Fullscreen" : "Fullscreen Chart"}
                  </button>
                  <button
                    className="btn enhanced-btn download-btn"
                    onClick={downloadCSV}
                  >
                    <Download size={16} /> Download Report
                  </button>
                </div>

                <h4 style={{ marginTop: "10px" }}>Live Heart Rate Chart</h4>
                <div
                  style={{ width: "100%", height: fullscreenChart ? 400 : 200 }}
                >
                  <ResponsiveContainer>
                    <LineChart data={hrHistory}>
                      <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                      <XAxis dataKey="time" />
                      <YAxis domain={["auto", "auto"]} />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="ai"
                        stroke="#28a745"
                        name="AI HR"
                      />
                      <Line
                        type="monotone"
                        dataKey="hw"
                        stroke="#007bff"
                        name="HW HR"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamDetails;
