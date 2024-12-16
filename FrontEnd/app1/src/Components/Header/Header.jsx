import React, { useContext, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import MuiIconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import { currentUserContext } from "../../App.jsx";
import axios from "axios";
import { deleteCookie, getCookie } from "../Cookie/Cookie";
import { Back_Origin } from "../../Front_ENV";
import homePageIcon from "../../assets/homePageIcon.webp";
import "./Header.css";

const Header = () => {
  const {
    currentUser,
    isAuthenticated,
    setIsAuthenticated,
    setCurrentUser,
    showMessage,
  } = useContext(currentUserContext);
  const [anchorElNav, setAnchorElNav] = useState(null);
  const route = useLocation().pathname;
  const navigate = useNavigate();

  // Define pages and filter dynamically based on authentication and role
  const allPages = [
    { name: "Teams", to: "/teams", auth: false },
    { name: "My Team", to: "/my-team", auth: true, role: ["doctor"] },
    { name: "Doctors", to: "/doctors", auth: true, role: ["admin"] },
    { name: "Profile", to: "/profile", auth: true },
    { name: "Login", to: "/login", auth: false },
    { name: "Register", to: "/signup", auth: false },
  ];

  const menuPages = allPages.filter((page) => {
    // "Teams" is public for everyone
    if (page.name === "Teams") return true;

    if (!isAuthenticated && !page.auth) return true;

    if (isAuthenticated && page.auth) {
      if (currentUser?.role === "admin") {
        return ["Doctors", "Profile"].includes(page.name);
      }
      if (currentUser?.role === "doctor") {
        return ["My Team", "Profile"].includes(page.name);
      }
    }

    return false;
  });

  // Logout logic
  const onLogoutClick = async () => {
    const token = getCookie("token");
    if (token) {
      try {
        const endpoint =
          currentUser?.role === "admin"
            ? `${Back_Origin}/admins/logout`
            : `${Back_Origin}/logout`;

        await axios.post(
          endpoint,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );

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

  const handleOpenNavMenu = (event) => setAnchorElNav(event.currentTarget);
  const handleCloseNavMenu = () => setAnchorElNav(null);

  // Generate menu links
  const renderMenuLinks = (closeMenu = false) =>
    menuPages.map((page) => (
      <NavLink
        key={page.name}
        to={page.to}
        className={`nav-link ${route === page.to ? "active" : ""}`}
        onClick={closeMenu ? handleCloseNavMenu : undefined}
      >
        <MenuItem>
          <Typography>{page.name}</Typography>
        </MenuItem>
      </NavLink>
    ));

  return (
    <header
      className="header"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        backgroundColor: "#b4182d",
      }}
    >
      <nav className="navbar">
        {/* Logo */}
        <NavLink to="/" className="logo">
          Home
        </NavLink>
        <img src={homePageIcon} alt="Football" className="football-icon" />

        {/* Desktop Menu */}
        <div className="nav-links">
          {menuPages.map((page) =>
            page.name === "Logout" ? (
              <button
                key="logout"
                className="nav-link"
                onClick={onLogoutClick}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "white",
                }}
              >
                Logout
              </button>
            ) : (
              <NavLink
                key={page.name}
                to={page.to}
                className={`nav-link ${route === page.to ? "active" : ""}`}
              >
                {page.name}
              </NavLink>
            )
          )}
          {isAuthenticated && (
            <button
              className="nav-link"
              onClick={onLogoutClick}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "white",
              }}
            >
              Logout
            </button>
          )}
        </div>

        {/* Burger Menu for smaller screens */}
        <div className="burger-menu">
          <MuiIconButton
            size="large"
            aria-label="menu"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleOpenNavMenu}
          >
            <MenuIcon />
          </MuiIconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorElNav}
            open={Boolean(anchorElNav)}
            onClose={handleCloseNavMenu}
            PaperProps={{
              style: {
                backgroundColor: "#b4182d",
                color: "white",
                borderRadius: "8px",
              },
            }}
          >
            {renderMenuLinks(true)}
            {isAuthenticated && (
              <MenuItem>
                <button
                  className="nav-link"
                  onClick={() => {
                    handleCloseNavMenu();
                    onLogoutClick();
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  Logout
                </button>
              </MenuItem>
            )}
          </Menu>
        </div>
      </nav>
    </header>
  );
};

export default Header;
