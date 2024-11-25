import "./App.css";
import HomePage from "./Components/HomePage/HomePage";
import Footer from "./Components/Footer/Footer";
import Header from "./Components/Header/Header";
import Login from "./Components/Login/Login";
import SignUp from "./Components/SignUp/SignUp";
import  Profile from "./Components/Profile/Profile";
import Teams from "./Components/Teams/Teams";
import { Route,Routes } from "react-router";
import React,{ useState } from "react";
export const currentUserContext = React.createContext()
function App() {
  const [showHeaderAndFooter, setShowHeaderAndFooter] = useState(true);
  const [currentUser, setCurrentUser] = useState({
    isAuthenticated: false,
    role: null, // "player", "admin", "doctor"
    name: "",
  });
  return (
    <currentUserContext.Provider value={{ ...currentUser, setCurrentUser }}>
      <div className="body-container">
        {showHeaderAndFooter && <Header />}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="signup" element={<SignUp />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/teams" element={<Teams />} />
          </Routes>
        </main>
        {showHeaderAndFooter && <Footer />}
      </div>
    </currentUserContext.Provider>
  );
}

export default App;
