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

const Doctors = ({
  doctors: propDoctors,
  loading: propLoading,
  setDoctors,
}) => {
  const [localDoctors, setLocalDoctors] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    contactNumber: "",
    availability: { days: [], time: { start: "", end: "" } },
  });
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentDoctorId, setCurrentDoctorId] = useState(null);

  const { showMessage, setLoading, doctors, loading } =
    useContext(currentUserContext);

  useEffect(() => {
    setLocalDoctors(propDoctors);
  }, [propDoctors]);

  const handleOpen = useCallback((doctor = null) => {
    setEditMode(!!doctor);
    setFormData(
      doctor
        ? {
            _id: doctor._id,
            name: doctor.name,
            username: doctor.username,
            password: "",
            contactNumber: doctor.contactNumber,
            availability: doctor.availability || {
              days: [],
              time: { start: "", end: "" },
            },
          }
        : {
            _id: "",
            name: "",
            username: "",
            password: "",
            contactNumber: "",
            availability: { days: [], time: { start: "", end: "" } },
          }
    );
    setCurrentDoctorId(doctor ? doctor._id : null);
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

      const response = await axios({ method, url, headers, data: formData });

      if (response.data.error) {
        showMessage(response.data.error, true);
        return;
      }

      setDoctors((prev) =>
        editMode
          ? prev.map((doctor) =>
              doctor._id === currentDoctorId ? response.data : doctor
            )
          : [...prev, response.data]
      );

      showMessage("Doctor saved successfully", false);
      handleClose();
    } catch (error) {
      if (error.response?.status === 409) {
        showMessage("Username already exists. Please choose another.", true);
      } else {
        showMessage("Failed to save doctor", true);
      }
      console.error("Error saving doctor:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = useCallback(
    async (doctorId) => {
      if (!doctorId) {
        showMessage("Invalid doctor ID", true);
        return;
      }

      setLoading(true);
      try {
        const response = await axios.delete(
          `${Back_Origin}/doctors/${doctorId}`,
          { headers: { authorization: getCookie("token") || "" } }
        );

        if (response.data.error) {
          showMessage(response.data.error, true);
          return;
        }

        setDoctors((prev) => prev.filter((doctor) => doctor._id !== doctorId));
        showMessage("Doctor deleted successfully", false);
      } catch (error) {
        showMessage("Failed to delete doctor", true);
        console.error("Error deleting doctor:", error);
      } finally {
        setLoading(false);
      }
    },
    [showMessage, setLoading]
  );

  const timeOptions = useMemo(() => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${String(hour).padStart(2, "0")}:${String(
          minute
        ).padStart(2, "0")}`;
        times.push(time);
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
              <TableCell>ID</TableCell>
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
                  <TableCell>{doctor.id}</TableCell>
                  <TableCell>{doctor.name}</TableCell>
                  <TableCell>{doctor.username}</TableCell>
                  <TableCell>{doctor.contactNumber}</TableCell>
                  <TableCell>
                    {doctor.availability.days.join(", ")} (
                    {doctor.availability.time.start} -{" "}
                    {doctor.availability.time.end})
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
                      color="secondary"
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

      {/* Add/Edit Doctor Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editMode ? "Edit Doctor" : "Add Doctor"}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              margin="normal"
              label="ID"
              name="id"
              value={formData.id}
              onChange={handleChange}
              required
              disabled={editMode} // Disable ID field in edit mode
            />
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
              required={!editMode} // Password is required only for new doctors
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

            {/* Availability Start Time Dropdown */}
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

            {/* Availability End Time Dropdown */}
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
              <Button onClick={handleClose} color="danger">
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
