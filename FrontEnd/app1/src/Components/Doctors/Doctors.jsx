// components/Doctors.jsx
import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
  useMemo,
} from "react";
import {
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import axios from "axios";
import { Back_Origin } from "../../Front_ENV";
import { getCookie } from "../Cookie/Cookie";
import { currentUserContext } from "../../App";

const Doctors = () => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    contactNumber: "",
    availability: { days: [], time: { start: "", end: "" } },
  });
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  // Use the external UUID (doctor.id) for update/delete operations.
  const [currentDoctorId, setCurrentDoctorId] = useState(null);

  const { showMessage, setLoading, doctors, loading, setDoctors ,fetchDoctors} =
    useContext(currentUserContext);

  useEffect(() => {
    // You can perform side-effects here if needed.
  }, [doctors]);

  const handleOpen = useCallback((doctor = null) => {
    setEditMode(!!doctor);
    setFormData(
      doctor
        ? {
            name: doctor.name,
            username: doctor.username,
            password: "",
            contactNumber: doctor.contactNumber,
            // Ensure that availability is always defined.
            availability: doctor.availability || {
              days: [],
              time: { start: "", end: "" },
            },
          }
        : {
            name: "",
            username: "",
            password: "",
            contactNumber: "",
            availability: { days: [], time: { start: "", end: "" } },
          }
    );
    // Fix: use doctor?.id instead of undefined doctorId.
    setCurrentDoctorId(doctor ? doctor.id : null);
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    setCurrentDoctorId(null);
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleAvailabilityTimeChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      availability: {
        ...prev.availability,
        time: { ...prev.availability.time, [name]: value },
      },
    }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = editMode
        ? `${Back_Origin}/doctors/${currentDoctorId}`
        : `${Back_Origin}/doctors`;
      const method = editMode ? "put" : "post";
      const headers = { authorization: getCookie("token") || "" };

      // If editing, remove password if empty to avoid validation errors.
      const dataToSend = { ...formData };
      if (
        editMode &&
        (!dataToSend.password || dataToSend.password.trim() === "")
      ) {
        delete dataToSend.password;
      }

      const response = await axios({ method, url, headers, data: dataToSend });
      // Update state immediately without a page refresh.
      if (editMode) {
        setDoctors((prev) =>
          prev.map((doctor) =>
            doctor.id === currentDoctorId ? response.data : doctor
          )
        );
        showMessage("Doctor updated successfully", false);
      } else {
        setDoctors((prev) => [...prev, response.data]);
        showMessage("Doctor added successfully", false);
      }
      handleClose();
    } catch (error) {
      const errorMsg = error.response?.data?.error || "Operation failed";
      showMessage(errorMsg, true);
    } finally {
      setLoading(false);
    }
  };
const handleDelete = async (doctorId) => {
  try {
    const res = await fetch(`${Back_Origin}/doctors/${doctorId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: getCookie("token") || "",
      },
    });

    if (!res.ok) {
      showMessage("Failed to delete doctor", true);
      return;
    }

    setDoctors((prev) => prev.filter((doctor) => doctor._id !== doctorId));

    showMessage("Doctor deleted successfully", false);

    // Delay fetch to ensure backend update is reflected
    setTimeout(() => {
      fetchDoctors(setLoading, setDoctors);
    }, 500);
  } catch (error) {
    showMessage("Error deleting doctor", true);
    console.error(error);
  }
};


  const timeOptions = useMemo(() => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        times.push(
          `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`
        );
      }
    }
    return times;
  }, []);

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleOpen()}
        style={{ margin: "2%" }}
      >
        Add Doctor
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Contact Number</TableCell>
              <TableCell>Availability</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : doctors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No doctors found.
                </TableCell>
              </TableRow>
            ) : (
              doctors.map((doctor) => (
                <TableRow key={doctor.id}>
                  <TableCell>{doctor.name}</TableCell>
                  <TableCell>{doctor.username}</TableCell>
                  <TableCell>{doctor.contactNumber}</TableCell>
                  <TableCell>
                    {doctor.availability?.days?.join(", ") || ""} (
                    {doctor.availability?.time?.start || ""} -{" "}
                    {doctor.availability?.time?.end || ""})
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() => handleOpen(doctor)}
                      variant="contained"
                      color="primary"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(doctor.id)}
                      variant="contained"
                      style={{ backgroundColor: "#b4182d" }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editMode ? "Edit Doctor" : "Add Doctor"}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              margin="normal"
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required={!editMode}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Contact Number"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              required
            />

            <FormControl fullWidth margin="normal">
              <InputLabel>Availability Start Time</InputLabel>
              <Select
                name="start"
                value={formData.availability.time.start}
                onChange={handleAvailabilityTimeChange}
                required
              >
                {timeOptions.map((time) => (
                  <MenuItem key={time} value={time}>
                    {time}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel>Availability End Time</InputLabel>
              <Select
                name="end"
                value={formData.availability.time.end}
                onChange={handleAvailabilityTimeChange}
                required
              >
                {timeOptions.map((time) => (
                  <MenuItem key={time} value={time}>
                    {time}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <DialogActions>
              <Button onClick={handleClose} color="error">
                Cancel
              </Button>
              <Button type="submit" color="primary">
                {editMode ? "Update" : "Add"}
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Doctors;
