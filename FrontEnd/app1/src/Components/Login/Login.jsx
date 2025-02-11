import { useState, useContext } from "react";
import { currentUserContext } from "../../App.jsx";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import "react-toastify/dist/ReactToastify.css";
import {
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  TextField,
  InputAdornment,
  Box,
  IconButton,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { NavLink, useNavigate } from "react-router-dom";
import { setCookie } from "../Cookie/Cookie.jsx";
import { Back_Origin } from "../../Front_ENV.jsx";
import "./Login.css";
import Loader from "../Loader/Loader.jsx";

const Login = () => {
  const { setCurrentUser, setIsAuthenticated, showMessage } =
    useContext(currentUserContext);
  const [showPassword, setShowPassword] = useState(false);
  const [loader, setLoader] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  if (loader) {
    return <Loader />;
  }

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();

  // Handle keypress for Enter key navigation
  const handleKeyPress = (e, field) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (!e.target.value) {
        showMessage(" Please enter your " + field, true);
        return;
      }
      if (field === "username") {
        // Move focus to the password field
        e.target.parentElement.parentElement.nextElementSibling.children[1].children[0].focus();
      } else if (field === "password") {
        // Submit the form when pressing Enter on the password field
        handleSubmit(e);
      }
    }
  };

  // Validate form inputs
  const validateForm = () => {
    const errors = {};
    if (!formData.username) errors.username = "Username is required";
    if (!formData.password) errors.password = "Password is required";
    return errors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoader(true);

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      showMessage("Please fill in all required fields", true);
      setLoader(false);
      return;
    }

    try {
      // Attempt Admin Login
      let response = await fetch(`${Back_Origin}/admins/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        // If Admin login fails, try Doctor login
        response = await fetch(`${Back_Origin}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      }

      const data = await response.json();
      setLoader(false);

      if (response.ok && data?.data) {
        showMessage(data.message || "Login successful", false);
        setCookie("token", data.data);
        setIsAuthenticated(true);
        setCurrentUser(jwtDecode(data.data));
        navigate("/teams");
      } else {
        showMessage(data?.error || "Invalid credentials", true);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Login Error:", error);
      setLoader(false);
      showMessage("Login failed. Please try again.", true);
      setIsAuthenticated(false);
    }
  };


  return (
    <>
      <Box
        className="login-container"
        sx={{
          maxWidth: "70%",
          margin: "auto",
          padding: "30px",
          borderRadius: "9px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          "@media (max-width: 880px)": {
            padding: "40px",
            borderRadius: "8px",
            width: "50% !important",
          },
        }}
      >
        <h4
          className="mb-3"
          style={{
            color: "#b4182d",
            fontFamily: "fantasy",
            fontWeight: "lighter",
          }}
        >
          Login to your account
        </h4>
        <form onSubmit={handleSubmit}>
          {/* Username Field */}
          <TextField
            label="Username"
            name="username"
            fullWidth
            type="text"
            value={formData.username}
            onKeyDown={(e) => handleKeyPress(e, "username")}
            onChange={(e) => {
              setFormData({ ...formData, username: e.target.value });
              toast.dismiss();
            }}
            required
            sx={{
              my: 2,
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "grey" },
                "&:hover fieldset": { borderColor: "#274546" },
                "&.Mui-focused fieldset": { borderColor: "#274546" },
              },
              "& .MuiInputLabel-root": {
                "&.Mui-focused": { color: "#274546 !important" },
              },
            }}
          />

          {/* Password Field */}
          <FormControl
            variant="outlined"
            fullWidth
            sx={{
              my: 2,
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "grey" },
                "&:hover fieldset": { borderColor: "#274546" },
                "&.Mui-focused fieldset": { borderColor: "#274546" },
              },
              "& .MuiInputLabel-root": {
                "&.Mui-focused": { color: "#274546 !important" },
              },
            }}
          >
            <InputLabel>Password</InputLabel>
            <OutlinedInput
              name="password"
              value={formData.password}
              onChange={(e) => {
                setFormData({ ...formData, password: e.target.value });
              }}
              type={showPassword ? "text" : "password"}
              onKeyDown={(e) => handleKeyPress(e, "password")}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
            />
          </FormControl>

          {/* Sign In Button */}
          <Button
            type="submit"
            variant="contained"
            className="extraBold-text pascalCase-text"
            fullWidth
            sx={{
              backgroundColor: "#b4182d",
              color: "white",
              "&:hover": { backgroundColor: "black" },
            }}
          >
            Sign In
          </Button>

          {/* Sign Up Link */}
          <NavLink
            to="/signup"
            variant="body2"
            className="blue-text"
            style={{
              display: "block",
              marginTop: "1rem",
              color: "black",
            }}
          >
            Don't have an account?{" "}
            <span style={{ color: "#1e3a85", fontWeight: "bolder" }}>
              Sign up
            </span>
          </NavLink>
        </form>
      </Box>
    </>
  );
};

export default Login;
