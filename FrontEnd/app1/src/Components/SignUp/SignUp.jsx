import React, { useState, useContext } from "react";
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Box,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { currentUserContext } from "../../App.jsx";
import { Back_Origin } from "../../Front_ENV.jsx";
import { setCookie } from "../Cookie/Cookie.jsx";
import { jwtDecode } from "jwt-decode";
import "./SignUp.css";

const SignUp = () => {
  const navigate = useNavigate();
  const { setCurrentUser, setIsAuthenticated, showMessage } =
    useContext(currentUserContext);

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    confirmPassword: "",
    role: "",
    contactNumber: "",
    accessCode: "",
  });

  const [gender, setGender] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleRoleChange = (e) => {
    setFormData({ ...formData, role: e.target.value, accessCode: "" });
    setErrors((prev) => ({ ...prev, role: "", accessCode: "" }));
  };

  const handleGenderChange = (e) => {
    setGender(e.target.value);
    setErrors((prev) => ({ ...prev, gender: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!formData.password.trim() || formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords must match";
    if (!formData.role) newErrors.role = "Role is required";
    if (formData.role === "doctor" && !formData.contactNumber.trim())
      newErrors.contactNumber = "Contact number is required";
    if (formData.role === "admin" && !formData.accessCode.trim())
      newErrors.accessCode = "Access code is required";
    if (!gender) newErrors.gender = "Gender is required";

    return newErrors; 
  };

const handleSubmit = async (event) => {
  event.preventDefault();
  setLoading(true);

  const formErrors = validateForm();
  if (Object.keys(formErrors).length > 0) {
    setErrors(formErrors);
    setLoading(false);
    return;
  }

  try {
    const endpoint =
      formData.role === "admin" ? "admins/signup" : "doctors/signup";

    const { confirmPassword, ...cleanData } = formData;
    const requestBody = { ...cleanData, gender };

    const response = await fetch(`${Back_Origin}/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();
    setLoading(false);
    console.log("Response Data:", data);

    if (response.ok && data.data) {
      // ✅ Signup was successful
      showMessage(data.message || "Signup successful", false);
      setCookie("token", data.data);
      setIsAuthenticated(true);
      setCurrentUser(jwtDecode(data.data));

      // ✅ Navigate after short delay
      setTimeout(() => navigate("/login"), 300);
    } else if (data.error) {
      // ✅ Show only the error if no data exists
      showMessage(data.error, true);
      setIsAuthenticated(false);

      // ✅ Handle specific access code errors
      if (data.error.toLowerCase().includes("access code")) {
        setErrors((prev) => ({ ...prev, accessCode: data.error }));
      }
    }
  } catch (error) {
    setLoading(false);
    setIsAuthenticated(false);
    showMessage("Signup failed. Please try again.", true);
  }
};

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        maxWidth: { xs: "90%", sm: "60%", md: "40%", lg: "35%" },
        margin: "auto",
        padding: "30px",
        borderRadius: "9px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        backgroundColor: "white",
      }}
    >
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          fontSize: "27px",
          color: "#b4182d",
          fontFamily: "fantasy",
          textAlign: "center",
        }}
      >
        Sign Up
      </Typography>

      <TextField
        label="Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
        error={!!errors.name}
        helperText={errors.name}
      />
      <TextField
        label="Username"
        name="username"
        value={formData.username}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
        error={!!errors.username}
        helperText={errors.username}
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
        error={!!errors.password}
        helperText={errors.password}
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
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword}
      />

      <FormControl fullWidth margin="normal" error={!!errors.role}>
        <InputLabel>Role</InputLabel>
        <Select
          value={formData.role}
          onChange={handleRoleChange}
          name="role"
          required
        >
          <MenuItem value="doctor">Doctor</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
        </Select>
      </FormControl>

      {formData.role === "admin" && (
        <TextField
          label="Access Code"
          name="accessCode"
          type="password"
          value={formData.accessCode}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          error={!!errors.accessCode}
          helperText={errors.accessCode}
        />
      )}

      {formData.role === "doctor" && (
        <TextField
          label="Contact Number"
          name="contactNumber"
          value={formData.contactNumber}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          error={!!errors.contactNumber}
          helperText={errors.contactNumber}
        />
      )}

      <FormControl
        component="fieldset"
        fullWidth
        margin="normal"
        error={!!errors.gender}
      >
        <FormLabel>Gender</FormLabel>
        <RadioGroup
          row
          name="gender"
          value={gender}
          onChange={handleGenderChange}
        >
          <FormControlLabel value="Male" control={<Radio />} label="Male" />
          <FormControlLabel value="Female" control={<Radio />} label="Female" />
        </RadioGroup>
      </FormControl>

      <Button
        variant="contained"
        type="submit"
        fullWidth
        disabled={loading}
        sx={{
          backgroundColor: "#b4182d",
          color: "white",
          "&:hover": { backgroundColor: "black" },
          mt: 2,
        }}
      >
        {loading ? "Signing Up..." : "Sign Up"}
      </Button>
    </Box>
  );
};

export default SignUp;
