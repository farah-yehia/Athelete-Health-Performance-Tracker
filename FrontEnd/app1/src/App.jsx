import React, { useState, useEffect } from "react";
import {
  Route,
  Routes,
  useNavigate,
  useLocation,
  Navigate,
} from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { Back_Origin } from "./Front_ENV";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import HomePage from "./Components/HomePage/HomePage";
import Footer from "./Components/Footer/Footer";
import Header from "./Components/Header/Header";
import Login from "./Components/Login/Login";
import SignUp from "./Components/SignUp/SignUp";
import Profile from "./Components/Profile/Profile";
import Teams from "./Components/Teams/Teams";
import MyTeam from "./Components/MyTeam/MyTeam";
import Doctors from "./Components/Doctors/Doctors";
import Logout from "./Components/Logout/Logout";
import Loader from "./Components/Loader/Loader";
import TeamDetails from "./Components/TeamDetails/TeamDetails";
import {
  getCookie,
  deleteCookie,
  checkCookieExpiry,
} from "./Components/Cookie/Cookie";

export const currentUserContext = React.createContext();

const fetchLeagues = async (setLoading, setData, team) => {
  setLoading(true);
  try {
    const encodedTeam = encodeURIComponent(team); // Encode the team name
    const response = await axios.get(
      `${Back_Origin}/api/teams?team=${encodedTeam}`
    );
    const players = response.data?.players || []; // Adjust based on response structure
    setData(players);
    console.log(`Fetched players for ${team}:`, players);
  } catch (error) {
    console.error("Error fetching players by team:", error.message);
  } finally {
    setLoading(false);
  }
};

const fetchDoctors = async (setLoading, setDoctors) => {
  setLoading(true);
  try {
    const res = await fetch(`${Back_Origin}/fetchDoctors`, {
      headers: { authorization: getCookie("token") || "" },
    });
    const data = await res.json();
    console.log("Fetched doctors:", data); // Verify response
    setDoctors(data);
  } catch (error) {
    console.error("Error fetching doctors", error);
  } finally {
    setLoading(false);
  }
};
function App() {
  const [showHeaderAndFooter, setShowHeaderAndFooter] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(!!getCookie("token"));
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [data, setData] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchDoctors(setLoading, setDoctors);
  }, []);

  useEffect(() => {
    fetchLeagues(setLoading, setData, "Man City");
  }, []);

  useEffect(() => {
    const token = getCookie("token");
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        setCurrentUser(decodedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Invalid token:", error);
        logoutUser();
      }
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const logoutUser = async () => {
    try {
      await axios.post(`${Back_Origin}/admins/logout`);
    } catch (error) {
      console.error("Error during logout:", error);
    }
    deleteCookie("token");
    setCurrentUser({});
    setIsAuthenticated(false);
    navigate("/login");
  };

  const showMessage = (msg, error = false) => {
    toast[error ? "error" : "success"](msg, {
      autoClose: 3000,
      closeOnClick: true,
    });
  };

  const ProtectedRoute = ({ children, role }) => {
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    if (role && currentUser?.role !== role) return <Navigate to="/" replace />;
    return children;
  };

  return (
    <currentUserContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        showMessage,
        isAuthenticated,
        setIsAuthenticated,
        logoutUser,
        setLoading,
        loading,
        doctors,
        fetchDoctors,
        setDoctors
      }}
    >
      <div className="body-container">
        {showHeaderAndFooter && <Header />}
        <main className="main-content">
          <ToastContainer />
          {loading ? (
            <Loader />
          ) : (
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/teams"
                element={
                  <Teams
                    data={data}
                    fetchLeagues={fetchLeagues}
                    setData={setData}
                    setLoading={setLoading}
                  />
                }
              />
              <Route
                path="/teams/:team"
                element={
                  <TeamDetails
                    fetchLeagues={fetchLeagues}
                    setLoading={setLoading}
                    setData={setData}
                    data={data}
                  />
                }
              />
              <Route
                path="/doctors"
                element={
                  <ProtectedRoute role="admin">
                    <Doctors  />
                  </ProtectedRoute>
                }
              />
              <Route path="/logout" element={<Logout />} />
            </Routes>
          )}
        </main>
        {showHeaderAndFooter && <Footer />}
      </div>
    </currentUserContext.Provider>
  );
}

export default App;
