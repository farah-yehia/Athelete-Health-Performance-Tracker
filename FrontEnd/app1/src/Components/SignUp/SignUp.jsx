import React, { useState } from "react";
import {
  TextField,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Typography,
  Box,
} from "@mui/material";
import { Back_Origin } from "../../Front_ENV.jsx";
import { useNavigate, useLocation } from "react-router";

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    confirmPassword: "",
    id: "",
    contactNumber: "",
    availability: "",
    team: "",
  });
  const [gender, setGender] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  // Dynamically get role from query parameters
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const role = queryParams.get("role") || "guest";
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGenderChange = (e) => {
    setGender(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const endpoint =
        role === "admin"
          ? `${Back_Origin}/admins/signup`
          : `${Back_Origin}/signup`;

      const payload = { ...formData, gender, role };
      if (role === "admin") delete payload.id; // Admin doesn't require ID

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log(response.status, data); // Log response for debugging

      if (!response.ok) {
        throw new Error(data.message || "An error occurred during signup.");
      }

      setSuccess(data.message || "Signup successful!");
      navigate("/login");
    } catch (err) {
      setError(err.message || "An error occurred during signup.");
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        maxWidth: "400px",
        margin: "auto",
        padding: 3,
        border: "1px solid #ccc",
        borderRadius: 2,
      }}
    >
      <Typography variant="h5" gutterBottom>
        {<h4 className="mb-3">Signing up as: {role}</h4>}
      </Typography>
      <TextField
        label="Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Username"
        name="username"
        value={formData.username}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Password"
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Confirm Password"
        name="confirmPassword"
        type="password"
        value={formData.confirmPassword}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />
      {role === "doctor" && (
        <>
          <TextField
            label="ID"
            name="id"
            value={formData.id}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Contact Number"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Availability"
            name="availability"
            value={formData.availability}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
        </>
      )}
      <FormControl component="fieldset" margin="normal" required>
        <FormLabel component="legend">Gender</FormLabel>
        <RadioGroup value={gender} onChange={handleGenderChange} row>
          <FormControlLabel value="Male" control={<Radio />} label="Male" />
          <FormControlLabel value="Female" control={<Radio />} label="Female" />
        </RadioGroup>
      </FormControl>
      <Button
        variant="contained"
        type="submit"
        fullWidth
        sx={{
          backgroundColor: "black",
          color: "white",
          "&:hover": {
            backgroundColor: "#b4182d",
          },
        }}
      >
        Sign Up
      </Button>
      {error && (
        <Typography color="error" mt={2}>
          {error}
        </Typography>
      )}
      {success && (
        <Typography color="success" mt={2}>
          {success}
        </Typography>
      )}
    </Box>
  );
};

export default SignUp;
