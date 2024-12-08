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

import { getCookie, deleteCookie } from "./Components/Cookie/Cookie";

export const currentUserContext = React.createContext();
const teams = [
  {
    name: "Player 1 - Arsenal",
    id: "Arsenal-1",
    gender: "Male",
    weight: 85,
    height: 180,
    age: 25,
    team: "Arsenal",
    role: "player",
    image: "",
    healthMetrics: {
      heartRate: 75,
      distanceCovered: 6.5,
      lastUpdated: "2024-12-07T10:30:00.000Z",
    },
    doctor: null,
    comments: [],
  },
  {
    name: "Player 2 - Chelsea",
    id: "Chelsea-1",
    gender: "Female",
    weight: 70,
    height: 175,
    age: 23,
    team: "Chelsea",
    role: "player",
    image: "",
    healthMetrics: {
      heartRate: 80,
      distanceCovered: 7.2,
      lastUpdated: "2024-12-07T10:35:00.000Z",
    },
    doctor: null,
    comments: [],
  },
  {
    name: "Player 3 - Manchester United",
    id: "ManUtd-1",
    gender: "Male",
    weight: 88,
    height: 185,
    age: 27,
    team: "Manchester United",
    role: "player",
    image: "",
    healthMetrics: {
      heartRate: 78,
      distanceCovered: 8.1,
      lastUpdated: "2024-12-07T10:40:00.000Z",
    },
    doctor: null,
    comments: [],
  },
  {
    name: "Player 4 - Liverpool",
    id: "Liverpool-1",
    gender: "Female",
    weight: 65,
    height: 170,
    age: 22,
    team: "Liverpool",
    role: "player",
    image: "",
    healthMetrics: {
      heartRate: 82,
      distanceCovered: 7.8,
      lastUpdated: "2024-12-07T10:45:00.000Z",
    },
    doctor: null,
    comments: [],
  },
  {
    name: "Player 5 - Barcelona",
    id: "Barcelona-1",
    gender: "Male",
    weight: 77,
    height: 178,
    age: 26,
    team: "Barcelona",
    role: "player",
    image: "",
    healthMetrics: {
      heartRate: 76,
      distanceCovered: 6.8,
      lastUpdated: "2024-12-07T10:50:00.000Z",
    },
    doctor: null,
    comments: [],
  },
  {
    name: "Player 6 - Real Madrid",
    id: "RealMadrid-1",
    gender: "Male",
    weight: 92,
    height: 182,
    age: 28,
    team: "Real Madrid",
    role: "player",
    image: "",
    healthMetrics: {
      heartRate: 74,
      distanceCovered: 7.0,
      lastUpdated: "2024-12-07T10:55:00.000Z",
    },
    doctor: null,
    comments: [],
  },
  {
    name: "Player 7 - Bayern Munich",
    id: "Bayern-1",
    gender: "Female",
    weight: 72,
    height: 176,
    age: 24,
    team: "Bayern Munich",
    role: "player",
    image: "",
    healthMetrics: {
      heartRate: 79,
      distanceCovered: 6.9,
      lastUpdated: "2024-12-07T11:00:00.000Z",
    },
    doctor: null,
    comments: [],
  },
  {
    name: "Player 8 - Juventus",
    id: "Juventus-1",
    gender: "Male",
    weight: 84,
    height: 183,
    age: 29,
    team: "Juventus",
    role: "player",
    image: "",
    healthMetrics: {
      heartRate: 77,
      distanceCovered: 6.7,
      lastUpdated: "2024-12-07T11:05:00.000Z",
    },
    doctor: null,
    comments: [],
  },
  {
    name: "Player 9 - PSG",
    id: "PSG-1",
    gender: "Female",
    weight: 69,
    height: 174,
    age: 21,
    team: "PSG",
    role: "player",
    image: "",
    healthMetrics: {
      heartRate: 81,
      distanceCovered: 7.4,
      lastUpdated: "2024-12-07T11:10:00.000Z",
    },
    doctor: null,
    comments: [],
  },
  {
    name: "Player 10 - AC Milan",
    id: "ACMilan-1",
    gender: "Male",
    weight: 80,
    height: 179,
    age: 27,
    team: "AC Milan",
    role: "player",
    image: "",
    healthMetrics: {
      heartRate: 90,
      distanceCovered: 7,
      lastUpdated: "2024-12-07T11:10:00.000Z",
    },
  },
];

function App() {
  const [showHeaderAndFooter, setShowHeaderAndFooter] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(!!getCookie("token"));
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const[data,setData]=useState(teams)
  const navigate = useNavigate();
  const location = useLocation();

  // Show/hide header and footer dynamically
  useEffect(() => {
    const noHeaderFooterRoutes = [""];
    setShowHeaderAndFooter(!noHeaderFooterRoutes.includes(location.pathname));
  }, [location.pathname]);

  // Handle authentication state and fetch user details
  useEffect(() => {
    const token = getCookie("token");
    if (isAuthenticated && token) {
      try {
        const decodedUser = jwtDecode(token);
        setCurrentUser(decodedUser);
      } catch (error) {
        console.error("Invalid token:", error);
        logoutUser();
      }
    }
  }, [isAuthenticated]);

  // Logout function
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

  // Notification utility
  const showMessage = (msg, error = false) => {
    toast[error ? "error" : "success"](msg, {
      autoClose: 3000,
      closeOnClick: true,
    });
  };

  // Route Protection Wrapper
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
                    <Teams data={data} />
                 
                }
              />
              <Route
                path="/my-team"
                element={
                  <ProtectedRoute role="doctor">
                    <MyTeam />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/doctors"
                element={
                  <ProtectedRoute role="admin">
                    <Doctors />
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
