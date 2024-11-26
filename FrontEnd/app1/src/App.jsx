import React, { useState, useEffect } from "react";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import {jwtDecode} from "jwt-decode";
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
import Loader from "./Components/Loader/Loader"; // Placeholder for the loader

import { getCookie, deleteCookie } from "./Components/Cookie/Cookie";

export const currentUserContext = React.createContext();

let messagesList = [];

function App() {
  const [showHeaderAndFooter, setShowHeaderAndFooter] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(!!getCookie("token"));
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  // Set `showHeaderAndFooter` dynamically based on route
  useEffect(() => {
    const noHeaderFooterRoutes = ["/login", "/signup"];
    setShowHeaderAndFooter(!noHeaderFooterRoutes.includes(location.pathname));
  }, [location.pathname]);

  // Handle authentication state and current user
  useEffect(() => {
    const token = getCookie("token");
    if (isAuthenticated && token) {
      try {
        setCurrentUser(jwtDecode(token));
      } catch (error) {
        console.error("Invalid token:", error);
        setIsAuthenticated(false);
        deleteCookie("token");
      }
    }
  }, [isAuthenticated]);

  // Utility: Toast Notifications
  const showMessage = (msg, error = false) => {
    if (msg && typeof error === "boolean" && !messagesList.includes(msg)) {
      messagesList.push(msg);
      toast[error ? "error" : "success"](msg, {
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        onClose: () => {
          messagesList = messagesList.filter((e) => e !== msg);
        },
      });
    }
  };

  // Logout Functionality
  const onLogoutClick = async () => {
    const token = getCookie("token");
    if (token) {
      try {
        await axios.post(`${Back_Origin}/admins/logout`);
        deleteCookie("token");
        setCurrentUser({});
        setIsAuthenticated(false);
        showMessage("You Logged Out Successfully", false);
        navigate("/login");
      } catch (error) {
        console.error("Logout Error:", error);
        showMessage("An error occurred during logout", true);
      }
    }
  };

  // Utility: Confirmation Toast
  const confirmationToast = (confirmationMsg) => {
    return new Promise((resolve) => {
      toast.info(
        <div>
          <h6 className="mb-3">{confirmationMsg}</h6>
          <div className="d-flex justify-content-center gap-3">
            <button
              onClick={() => {
                resolve(true);
                toast.dismiss();
              }}
              style={{
                padding: "5px 15px",
                backgroundColor: "green",
                color: "white",
                border: "none",
                borderRadius: "3px",
                cursor: "pointer",
              }}
            >
              Confirm
            </button>
            <button
              onClick={() => {
                resolve(false);
                toast.dismiss();
              }}
              style={{
                padding: "5px 15px",
                backgroundColor: "red",
                color: "white",
                border: "none",
                borderRadius: "3px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </div>,
        {
          className: "toast-confirm",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
    });
  };

  return (
    <currentUserContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        showMessage,
        isAuthenticated,
        setIsAuthenticated,
        onLogoutClick,
      }}
    >
      <div className="body-container">
        {showHeaderAndFooter && <Header />}
        <main className="main-content">
          <ToastContainer style={{ width: "fit-content" }} />
          {loading ? (
            <Loader />
          ) : (
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/teams" element={<Teams />} />
              <Route path="/doctors" element={<Doctors />} />
              <Route path="/my-team" element={<MyTeam />} />
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
