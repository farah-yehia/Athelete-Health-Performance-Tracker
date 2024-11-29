import React, { useState, useContext } from "react";
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
  MenuItem,
  Select,
  InputLabel,
  FormGroup,
  Checkbox,
} from "@mui/material";
import { Back_Origin } from "../../Front_ENV.jsx";
import { useNavigate } from "react-router";
import { currentUserContext } from "../../App.jsx";

const SignUp = () => {
  const navigate = useNavigate();
  const { showMessage } = useContext(currentUserContext);

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    confirmPassword: "",
    role: "", // Default to doctor
    id: "",
    contactNumber: "",
    availability: "",
  });

  const [gender, setGender] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleGenderChange = (e) => {
    setGender(e.target.value);
  };

  const handleRoleChange = (e) => {
    setFormData({ ...formData, role: e.target.value });
  };

  const validateForm = () => {
    const newErrors = {};
    

    // General validations
    if (!formData.name.trim() || formData.name.length < 3) {
      newErrors.name = "Name must be at least 3 characters long";
    }
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }
    if (!formData.password.trim() || formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Role-specific validations
    if (!formData.role) {
      newErrors.role = "Role is required";
    } else if (formData.role === "doctor") {
      if (!formData.id.trim()) {
        newErrors.id = "ID is required for doctors";
      }
      if (!formData.contactNumber.trim()) {
        newErrors.contactNumber = "Contact number is required for doctors";
      }
    } else if (formData.role === "admin") {
      if (!formData.id.trim()) {
        newErrors.id = "ID is required for admins";
      }
    }

    // Gender validation
    if (!gender) {
      newErrors.gender = "Gender is required";
    }

    return newErrors;
  };

const handleCheckboxChange = (event) => {
  const { value, checked } = event.target;
  setFormData((prev) => {
    if (checked) {
      // Add day if checkbox is checked
      return { ...prev, availability: [...prev.availability, value] };
    } else {
      // Remove day if checkbox is unchecked
      return {
        ...prev,
        availability: prev.availability.filter((day) => day !== value),
      };
    }
  });
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
        formData.role === "admin" ? "admins/signup" : "signup";

      const response = await fetch(`${Back_Origin}/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          gender,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server Error:", errorData);
        showMessage(errorData.message || "Error creating account.", true);
        return;
      }

      const data = await response.json();
      console.log("Success:", data);
      showMessage("Account created successfully!", false);
      navigate("/login");
    } catch (error) {
      console.error("Network Error:", error);
      showMessage("Error creating account. Please try again.", true);
    } finally {
      setLoading(false);
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
        backgroundColor: "aliceblue",
      }}
    >
      <Typography variant="h5" gutterBottom style={{fontSize:" 1.5em !important" ,
    fontFamily:"Oswald" , fontWeight:"bolder"}}>
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
        <InputLabel id="role-label">Role</InputLabel>
        <Select
          labelId="role-label"
          value={formData.role}
          onChange={handleRoleChange}
          name="role"
          required
        >
          <MenuItem value="doctor">doctor</MenuItem>
          <MenuItem value="admin">admin</MenuItem>
        </Select>
      </FormControl>
      {formData.role === "doctor" && (
        <>
          <TextField
            label="ID"
            name="id"
            value={formData.id}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            error={!!errors.id}
            helperText={errors.id}
          />
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
          <FormControl component="fieldset" fullWidth margin="normal">
            <FormLabel component="legend">Availability</FormLabel>
            <FormGroup row>
              {[
                "Sunday",
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
              ].map((day) => (
                <FormControlLabel
                  key={day}
                  control={
                    <Checkbox
                      checked={formData.availability.includes(day)}
                      onChange={handleCheckboxChange}
                      value={day}
                    />
                  }
                  label={day}
                />
              ))}
            </FormGroup>
          </FormControl>
        </>
      )}
      {formData.role === "admin" && (
        <TextField
          label="ID"
          name="id"
          value={formData.id}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          error={!!errors.id}
          helperText={errors.id}
        />
      )}
      <FormControl
        component="fieldset"
        margin="normal"
        required
        error={!!errors.gender}
      >
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
        disabled={loading}
        sx={{
          backgroundColor: "black",
          color: "white",
          "&:hover": {
            backgroundColor: "#b4182d",
          },
        }}
      >
        {loading ? "Signing Up..." : "Sign Up"}
      </Button>
    </Box>
  );
};

export default SignUp;
