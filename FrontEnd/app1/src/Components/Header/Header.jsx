import React, { useContext , useState } from 'react'
import { NavLink, useLocation } from "react-router-dom";
import MuiIconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import { currentUserContext } from "../../App";
import homePageIcon from "../../assets/homePageIcon.webp"
import "./Header.css";

const Header = () => {
    const { currentUser, isAuthenticated } = useContext(currentUserContext);
    const [anchorElNav, setAnchorElNav] = useState(null);
    const route = useLocation().pathname;

    // Role-based pages
    const guestPages = [
      { name: "Login", to: "/login" },
      { name: "Signup", to: "/signup" },
      { name: "Teams", to: "/teams" },
    ];
    const adminPages = [
      { name: "Teams", to: "/teams" },
      { name: "Doctors", to: "/doctors" },
      { name: "Players", to: "/players" },
    ];
    const doctorPages = [
      { name: "Teams", to: "/teams" },
      { name: "My Team", to: "/my-team" },
    ];

    // Choose the menu based on the role
    const menuPages = !isAuthenticated
      ? guestPages
      : currentUser.role === "admin"
      ? adminPages
      : currentUser.role === "doctor"
      ? doctorPages
      : [];

    const handleOpenNavMenu = (event) => setAnchorElNav(event.currentTarget);
    const handleCloseNavMenu = () => setAnchorElNav(null);

  return (
    <div>
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
          <NavLink to="/" className="logo">
            Home
          </NavLink>
          <img
            src={homePageIcon}
            alt="Football"
            className="football-icon"
          />
          <div className="nav-links">
            {menuPages.map((page) => (
              <NavLink key={page.name} to={page.to} className="nav-link">
                {page.name}
              </NavLink>
            ))}
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
              {menuPages.map((page) => (
                <NavLink key={page.name} to={page.to} className="nav-link">
                  <MenuItem onClick={handleCloseNavMenu}>
                    <Typography>{page.name}</Typography>
                  </MenuItem>
                </NavLink>
              ))}
            </Menu>
          </div>
        </nav>
      </header>
    </div>
  );
}

export default Header
