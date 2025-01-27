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
    setFormData({ ...formData, role: e.target.value });
    setErrors((prev) => ({ ...prev, role: "" }));
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
    if (formData.role === "doctor") {
      if (!formData.contactNumber.trim())
        newErrors.contactNumber = "Contact number is required";
    }
    if (!gender) newErrors.gender = "Gender is required";
    return newErrors;
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  const formErrors = validateForm();
  if (Object.keys(formErrors).length > 0) {
    setErrors(formErrors);
    return;
  }

  setLoading(true);
  try {
    const endpoint =
      formData.role === "admin" ? "admins/signup" : "doctors/signup";

    const response = await fetch(`${Back_Origin}/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        gender,
      }),
    });

    const data = await response.json();
    console.log(data)
    setLoading(false);

    if (response.ok) {
      if (!data.error) {
        showMessage(data.message, false);
        setCookie("token", data.data);
        setIsAuthenticated(true);
        setCurrentUser(jwtDecode(data.data));
     
      } else {
        showMessage(data.error, true); // If there's an error in the response
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
  } catch (error) {
    setLoading(false);
   
    setIsAuthenticated(false);
  }
     navigate("/login");
};



  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        maxWidth: "50%",
        margin: "auto",
        padding: "30px",
        borderRadius: "9px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
      }}
    >
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          fontSize: "1.5em",
          fontWeight: "bolder",
          color: "#b4182d",
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

      <FormControl fullWidth margin="normal">
        <InputLabel>Role</InputLabel>
        <Select
          value={formData.role}
          onChange={handleRoleChange}
          name="role"
          required
          error={!!errors.role}
        >
          <MenuItem value="doctor">Doctor</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
        </Select>
      </FormControl>

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

      <FormControl component="fieldset" fullWidth margin="normal" required>
        <FormLabel>Gender</FormLabel>
        <RadioGroup row value={gender} onChange={handleGenderChange}>
          <FormControlLabel value="Male" control={<Radio />} label="Male" />
          <FormControlLabel value="Female" control={<Radio />} label="Female" />
        </RadioGroup>
      </FormControl>

      {errors.gender && (
        <Typography color="error" variant="body2">
          {errors.gender}
        </Typography>
      )}

      <Button
        variant="contained"
        type="submit"
        fullWidth
        disabled={loading}
        sx={{
          backgroundColor: "#b4182d",
          color: "white",
          "&:hover": { backgroundColor: "black" },
        }}
      >
        {loading ? "Signing Up..." : "Sign Up"}
      </Button>
    </Box>
  );
};

export default SignUp;
