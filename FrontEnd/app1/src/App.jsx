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

function App() {
  const [showHeaderAndFooter, setShowHeaderAndFooter] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(!!getCookie("token"));
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch league data
  useEffect(() => {
    const fetchLeagues = async () => {
      setLoading(true); // Start loading indicator
      try {
        // Fetch data from the backend
        const response = await axios.get(`${Back_Origin}/api/leagues`);

        // Validate and structure the data
        const leagues =
          response.data?.data?.map((league) => ({
            id: league.id || "N/A", // Fallback to "N/A" if ID is missing
            name: league.name || "Unknown League", // Default name if missing
            logo:
              league.logo_path ||
              league.logo ||
              "../public/default-player-image.png", // Serve a local fallback image
            number: league.number || "N/A",
            height: league.height || "N/A",
            weight: league.weight || "N/A",
            team: league.team || "Unknown Team",
            distance: league.distance || "N/A",
            img: league.img || "../public/default-player-image.png", // Use a public path for fallback image
          })) || [];

        // Update state with fetched data
        setData(leagues);

        // Log the result for debugging
        console.log("Fetched leagues:", leagues);
      } catch (error) {
        console.error(
          "Error fetching leagues:",
          error.response?.data || error.message
        );

        // Show an error notification
        toast.error("Failed to fetch league data. Please try again later.");
      } finally {
        setLoading(false); // Stop loading indicator
      }
    };

    fetchLeagues();
  }, [Back_Origin]); // Dependency array includes Back_Origin to refetch if it changes

  // Show/hide header and footer dynamically
  useEffect(() => {
    const noHeaderFooterRoutes = ["/login", "/signup"];
    setShowHeaderAndFooter(!noHeaderFooterRoutes.includes(location.pathname));
  }, [location.pathname]);

  // Handle authentication state
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
              <Route path="/teams" element={<Teams data={data} />} />
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
