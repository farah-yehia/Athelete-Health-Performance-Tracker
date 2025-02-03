const { Admin, Doctor, Player } = require("../db/Database");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const ENV = require("../env");
const axios = require("axios");
const { Secret_Key } = require("../env");
const mongoose = require("mongoose");
// Function to add a Admin
const getAdmin = async (req, res, next) => {
  try {
    const { id } = req.params; // Use req.params instead of req.body
    const admin = await Admin.findOne({ id });
    if (!admin) {
      return res.status(404).json({ error: "admin not found" });
    } else {
      res.status(200).json({ data: admin });
    }
  } catch (error) {
    res.status(500).json({ error: "Unexpected Error Occurred" });
    next(`ERROR IN: getAdmin function => ${error}`);
  }
};

// Function to delete a Admin
const deleteAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const admin = await Admin.findOneAndDelete({ id: id });

    if (!admin) {
      return res.status(404).json({ message: "admin not found" });
    }
    res
      .status(200)
      .json({ message: `Admin (${admin.name}) deleted successfully` });
  } catch (error) {
    res.status(500).json({ error: "Unexpected Error Occurred" });
    next(`ERROR IN: deleteadmin function => ${error}`);
  }
};

// Function to edit Admin details
const editAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const sentAdmin = req.body;
    const admin = await Admin.findOne({ id });
    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }
    const checkusername = await Admin.findOne({ username: sentAdmin.username });
    if (checkusername && checkusername.id !== id) {
      return res.status(404).json({ error: "username already exists" });
    }
    admin.name = sentAdmin.name;
    admin.username = sentAdmin.username;
    admin.role = sentAdmin.role;
    await admin.save();
    const token = await jwt.sign(sentAdmin, Secret_Key);

    res.status(201).json({
      message: `admin (${admin.name}) updated successfully`,
      data: token,
    });
  } catch (error) {
    res.status(200).json({ error: "Unexpected Error Occurred" });
    next(`ERROR IN: updateAdmin function => ${error}`);
  }
};

//Function to allow a Admin to create an account (signup)
const signupAdmin = async (req, res, next) => {
  try {
    const { name, username, password, role } = req.body;

    if (!validator.isLength(name, { min: 3 })) {
      return res
        .status(400)
        .json({ error: "Name must be at least 3 characters long" });
    }
    if (!validator.isAlphanumeric(username)) {
      return res.status(400).json({ error: "Username must be alphanumeric" });
    }
    if (!validator.isStrongPassword(password, { minLength: 8 })) {
      return res.status(400).json({
        error: "Password must be strong and at least 8 characters long",
      });
    }
    if (role !== "admin") {
      return res.status(400).json({ error: "Only admin role allowed here" });
    }

    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      return res.status(400).json({ error: "Username already exists" });
    }
    const adminId = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({
      name,
      id: adminId,
      username,
      password: hashedPassword,
      role,
    });

    await newAdmin.save();
    console.log(newAdmin);
    res
      .status(201)
      .json({ message: "Admin created successfully", data: newAdmin });
  } catch (error) {
    res.status(500).json({ error: "Unexpected Error Occurred" });
    next(`ERROR IN: signupAdmin function => ${error.message}`);
  }
};

// Function to login an Admin
const loginAdmin = async (req, res, next) => {
  try {
    console.log("req is => ", req.body);
    const { username, password } = req.body;
    console.log(username);
    // Validate the username
    if (!username || !validator.isAlphanumeric(username)) {
      return res.status(400).json({ error: "Valid username is required" });
    }
    if (!password || !validator.isLength(password, { min: 8 })) {
      return res
        .status(400)
        .json({ error: "Password must be at least 8 characters long" });
    }
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(404).json({ error: "Invalid username" });
    } else if (!(await bcrypt.compare(password, admin.password))) {
      return res.status(404).json({ error: "Invalid password" });
    } else {
      const token = await jwt.sign(
        {
          name: admin.name,
          username: admin.username,
          role: admin.role,
          password: admin.password,
          id: admin.id,
        },
        Secret_Key,
        { expiresIn: "1h" }
      );
      console.log(admin);
      res.status(201).json({ message: `Welcome ${admin.name}`, data: token });
    }
  } catch (error) {
    res.status(404).json({ error: "Unexpected Error Occurred" });
    next(`ERROR IN: login function => ${error}`);
  }
};
//logout
const logout = async (req, res, next) => {
  try {
    res.status(201).json({ message: "Logged out successfully" });
  } catch (err) {
    res.status(404).json({ error: "Unexpected Error Occurred" });
    next(`ERROR IN: Logout Function => ${err}`);
  }
};
// Player CRUD operations
const addPlayer = async (req, res) => {
  try {
    const player = new Player(req.body);
    await player.save();
    res.status(200).json(player);
  } catch (error) {
    res.status(400).json(`ERROR IN: addPlayer function => ${error}`);
  }
};
const deletePlayer = async (req, res) => {
  try {
    const playerId = req.params.playerId;
    await Player.findByIdAndDelete(playerId);
    res.status(200).json({ message: "Player deleted successfully" });
  } catch (error) {
    res.status(400).json(`ERROR IN: DeletePlayer function => ${error}`);
  }
};

const updatePlayer = async (req, res) => {
  try {
    const playerId = req.params.playerId;
    const updatedPlayer = req.body;
    await Player.findByIdAndUpdate(playerId, updatedPlayer, { new: true });
    res.status(200).json(updatedPlayer);
  } catch (error) {
    res.status(400).json(`ERROR IN: updatePlayer function => ${error}`);
  }
};

const doctors = [
  {
    id: "1",
    name: "Dr. Alice Smith",
    username: "alice.smith",
    password: "hashed_password", // Ensure to hash this
    contactNumber: "123-456-7890",
    availability: {
      days: ["Monday", "Wednesday"],
      time: { start: "09:00", end: "17:00" },
    },
  },
  {
    id: "2",
    name: "Dr. John Doe",
    username: "john.doe",
    password: "hashed_password",
    contactNumber: "987-654-3210",
    availability: {
      days: ["Tuesday", "Thursday"],
      time: { start: "10:00", end: "18:00" },
    },
  },
];

const seedDatabase = async () => {
  try {
    await Doctor.deleteMany(); // Clear existing doctors
    const saltRounds = 10;

    // Use map + Promise.all to correctly hash passwords
    const hashedDoctors = await Promise.all(
      doctors.map(async (doctor) => ({
        ...doctor,
        password: await bcrypt.hash(doctor.password, saltRounds),
      }))
    );

    await Doctor.insertMany(hashedDoctors);
    console.log("Doctors added successfully!");
  } catch (error) {
    console.error("Error seeding doctors:", error);
  }
};

// seedDatabase();

//fetch all doctors

const fetchDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({});
    console.log("*********************fetched*******************************");
    res.json(doctors);
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
const addDoctor = async (req, res) => {
  try {
    const { name, username, password, contactNumber, availability } = req.body;

    // Check if a doctor with the same username already exists
    const existingDoctor = await Doctor.findOne({ username });
    if (existingDoctor) {
      return res
        .status(409)
        .json({ error: "Doctor with the same username already exists" });
    }

    // Create a new doctor with a generated UUID for the external 'id' field
    const doctor = new Doctor({
      name,
      username,
      password,
      contactNumber,
      availability,
      id: uuidv4(), // external unique identifier
    });

    await doctor.save();
    // Return the doctor as a plain object with an explicit id property
    res.status(201).json({ ...doctor.toObject(), id: doctor.id });
  } catch (error) {
    console.error("Error adding doctor:", error);
    res.status(400).json({ error: "Failed to add doctor" });
  }
};

const deleteDoctor = async (req, res) => {
  try {
    // Use the route parameter "doctorId"
    const doctorId = req.params.doctorId;
    console.log(doctorId);
    // Find and delete by the external UUID field (doctor.id)
    const doctor = await Doctor.findOneAndDelete({ id: doctorId });
    console.log(doctor)
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.status(200).json({ message: "Doctor deleted successfully" });
  } catch (error) {
    console.error("Error deleting doctor:", error);
    res.status(400).json({ error: "Failed to delete doctor" });
  }
};

const updateDoctor = async (req, res) => {
  try {
    // Use the route parameter "doctorId"
    const doctorId = req.params.doctorId;
    const updateData = { ...req.body };

    // Remove password if empty to avoid triggering validation errors
    if (!updateData.password || updateData.password.trim() === "") {
      delete updateData.password;
    }

    // Update by matching the external UUID (doctor.id)
    const updatedDoctor = await Doctor.findOneAndUpdate(
      { id: doctorId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedDoctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.status(200).json({ ...updatedDoctor.toObject(), id: updatedDoctor.id });
  } catch (error) {
    console.error("Error updating doctor:", error);
    res.status(400).json({ error: "Failed to update doctor" });
  }
};
const FPL_API_URL = "https://fantasy.premierleague.com/api/bootstrap-static/";
const fetchLeagues = async (req, res) => {
  try {
    const response = await axios.get(FPL_API_URL);
    const players = response.data.elements.map((player) => ({
      id: player.id,
      name: `${player.first_name} ${player.second_name}`,
      number: player.code,
      height: player.height || "N/A", // Add a default value if not available
      weight: player.weight || "N/A",
      team:
        response.data.teams.find((team) => team.id === player.team)?.name ||
        "Unknown",
      distanceCovered: Math.random().toFixed(2),
      lastUpdated: Date.now(),
      heartRate: Math.random().toFixed(2),
      comments: [],
      age: Math.floor(Math.random() * (40 - 18 + 1)) + 18,
      img: player.photo
        ? `https://resources.premierleague.com/premierleague/photos/players/110x140/p${
            player.photo.split(".")[0]
          }.png`
        : "/default-player-image.png",
    }));

    console.log(players); // Verify the data

    res.status(200).json({ data: players });
  } catch (error) {
    console.error("Error fetching FPL data:", error.message);
    res.status(500).json({ error: "Failed to fetch player data." });
  }
};
const verifyResetToken = async (req, res, next) => {
  try {
    const token = req.params.token || req.headers["authorization"];
    const { role } = req.body;

    if (!token) {
      return res
        .status(400)
        .json({ error: "Password reset token is required." });
    }

    if (!role) {
      return res.status(400).json({ error: "Role is required." });
    }

    const Model = role === "admin" ? Admin : Doctor;

    const adm = await Model.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    const doc = await Model.findOne({
      "availability.resetPasswordToken": token,
      "availability.resetPasswordExpires": { $gt: Date.now() },
    });

    if (!adm && !doc) {
      return res.status(400).json({ error: "Invalid or expired token." });
    }

    res.status(200).json({ message: "Password reset token is valid." });
  } catch (error) {
    console.error("Error in verifyResetToken:", error);
    res.status(500).json({ error: "Unexpected error occurred." });
    next(`ERROR IN: verifyResetToken function => ${error}`);
  }
};
const resetPassword = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Token not provided" });
    }

    const secretKey = Secret_Key;
    let decoded;
    try {
      decoded = jwt.verify(token, secretKey);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token expired" });
      }
      return res.status(401).json({ message: "Invalid token" });
    }

    // Extract the necessary fields from the request body
    const { oldpassword, newpassword, role } = req.body;

    if (!decoded.id || !role || !newpassword) {
      return res.status(400).json({ message: "Invalid input" });
    }

    let userModel;
    if (role === "admin") {
      userModel = Admin;
    } else if (role === "doctor") {
      userModel = Doctor;
    } else {
      return res.status(400).json({ message: "Invalid role specified" });
    }

    // Query user based on the custom `id` field
    const user = await userModel.findOne({ id: decoded.id });

    console.log(user); // Debugging user data

    if (!user) {
      return res.status(404).json({ message: `${role} not found` });
    }

    // Validate old password

    const isMatch = await bcrypt.compare(oldpassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    // Hash and update the password
    const hashedPassword = await bcrypt.hash(newpassword, 10);
    user.password = hashedPassword;

    // Clear any reset token and expiration if previously set
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    // Save updated user data
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params; // Use custom `id` field
    const { role } = req.user; // Role from the authenticated user token
    const { name, username, password, contactNumber, availability } = req.body;

    // Determine which model to use based on role
    const UserModel = role === "admin" ? Admin : Doctor;

    const user = await UserModel.findOne({ id }); // Query using `id`

    if (!user) {
      return res.status(404).json({ error: `${role} not found` });
    }

    // Update user details
    if (name) user.name = name;
    if (username) {
      const existingUser = await UserModel.findOne({ username });
      if (existingUser && existingUser.id !== id) {
        return res.status(400).json({ error: "Username already exists" });
      }
      user.username = username;
    }
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }
    if (contactNumber) user.contactNumber = contactNumber;
    if (availability !== undefined) user.availability = availability;

    // Save the updated user
    await user.save();

    // Return the updated user
    const updatedUser = await UserModel.findOne({ id });
    res.status(200).json({
      message: `${role} (${user.name}) updated successfully`,
      data: updatedUser, // Send the updated data
    });
  } catch (error) {
    console.error("Error in updateUser:", error);
    res.status(500).json({ error: "Unexpected error occurred" });
  }
};

module.exports = {
  getAdmin,
  deleteAdmin,
  editAdmin,
  signupAdmin,
  loginAdmin,
  addPlayer,
  deletePlayer,
  updatePlayer,
  addDoctor,
  deleteDoctor,
  updateDoctor,
  logout,
  fetchLeagues,
  resetPassword,
  verifyResetToken,
  updateUser,
  fetchDoctors,
};
