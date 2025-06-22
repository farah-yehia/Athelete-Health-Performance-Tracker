import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import TeamsCard from "../TeamsCard/TeamsCard";
import { Back_Origin } from "../../Front_ENV";
import { Info, FileBarChart, Download } from "lucide-react";
import "./TeamDetails.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
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
  const [reportModal, setReportModal] = useState(null);

  const fetchTeamPlayers = async (teamName) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${Back_Origin}/api/teams?team=${encodeURIComponent(teamName)}`
      );
      setPlayers(res.data?.players || []);
    } catch (err) {
      setError("Error loading players.");
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
        const res = await axios.get(
          `${Back_Origin}/api/player/${selectedPlayerId}`
        );
        const {
          name,
          weight_kg,
          bmi,
          maxPlayTime,
          heartRate,
          MheartRate,
          distance,
        } = res.data;

        setSelectedPlayerStatic({ name, weight_kg, bmi, maxPlayTime });
        setSelectedPlayerLive({ heartRate, MheartRate, distance });

        setHrHistory((prev) => [
          ...prev.slice(-19),
          {
            time: new Date().toLocaleTimeString(),
            ai: heartRate,
            hw: MheartRate,
          },
        ]);
      } catch (err) {
        setSelectedPlayerStatic(null);
        setSelectedPlayerLive(null);
      }
    };

    fetchPlayer();
    const interval = setInterval(fetchPlayer, 5000);
    return () => clearInterval(interval);
  }, [selectedPlayerId]);

  const closeLiveModal = () => {
    setSelectedPlayerId(null);
    setSelectedPlayerStatic(null);
    setSelectedPlayerLive(null);
    setHrHistory([]);
  };

  const closeReportModal = () => setReportModal(null);

  const openLiveModal = (id) => {
    setSelectedPlayerId(id);
  };

  const openReportFromLive = () => {
    if (selectedPlayerStatic?.maxPlayTime) {
      setReportModal({
        name: selectedPlayerStatic.name,
        maxPlayTime: selectedPlayerStatic.maxPlayTime,
      });
    }
  };

  const downloadCSV = () => {
    if (!reportModal) return;

    const csvContent = `Player,Max Play Time (mins)\n${reportModal.name},${reportModal.maxPlayTime}`;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `max_play_time_${reportModal.name.replace(/\s+/g, "_")}.csv`
    );
    link.click();
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
        {players.map((player, idx) => (
          <div key={player._id || idx} className="card-container">
            <TeamsCard {...player} />
            <button
              className="info-icon"
              title="Live Monitor"
              onClick={() => openLiveModal(player._id)}
            >
              <Info size={20} color="white" />
            </button>
          </div>
        ))}
      </div>

      {/* Live Data Modal */}
      {selectedPlayerId && (
        <div className="modern-modal-overlay">
          <div className="modern-modal">
            <button className="close-btn" onClick={closeLiveModal}>
              &times;
            </button>

            {!selectedPlayerLive || !selectedPlayerStatic ? (
              <div className="spinner"></div>
            ) : (
              <>
                <h2 className="modal-title">
                  {selectedPlayerStatic.name}
                  <span className="live-badge">🟢 Live</span>
                </h2>

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
                </div>

                <div className="chart-container">
                  <h4>Live Heart Rate Chart</h4>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={hrHistory}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="ai"
                        stroke="#28a745"
                        dot={false}
                        name="AI HR"
                      />
                      <Line
                        type="monotone"
                        dataKey="hw"
                        stroke="#007bff"
                        dot={false}
                        name="HW HR"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {selectedPlayerStatic.maxPlayTime && (
                  <button
                    className="btn"
                    style={{ marginTop: "20px" }}
                    onClick={openReportFromLive}
                  >
                    <FileBarChart size={16} /> View Match Report
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Report Modal */}
      {reportModal && (
        <div className="modern-modal-overlay">
          <div className="modern-modal">
            <button className="close-btn" onClick={closeReportModal}>
              &times;
            </button>
            <h2 className="modal-title">📊 Match Report</h2>
            <div className="report-content">
              <p>
                <strong>Max Playing Time:</strong> {reportModal.maxPlayTime}{" "}
                mins
              </p>
            </div>
            <div
              className="report-buttons"
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
                marginTop: "20px",
              }}
            >
              <button className="btn" onClick={downloadCSV}>
                <Download size={16} /> Download Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamDetails;
