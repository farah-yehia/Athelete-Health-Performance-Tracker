const { Player, Doctor } = require("../db/Database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ENV = require("../env");
const validator = require("validator");
const { v4: uuidv4 } = require("uuid");
const { Secret_Key } = require("../env");
const signupDoctor = async (req, res, next) => {
  try {
    console.log("Doctor Signup Request Body:", req.body);

    const { name, username, password, role, contactNumber, availability } =
      req.body;

    // Validate role
    if (role !== "doctor") {
      return res.status(400).json({ error: "Only 'doctor' role is allowed" });
    }

    // Validate inputs
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
        error: "Password must be at least 8 characters long and strong",
      });
    }

    // Check if username exists
    const existingDoctor = await Doctor.findOne({ username });
    if (existingDoctor) {
      return res.status(400).json({ error: "Username already exists" });
    }

    // Create and store new doctor
    const doctorId = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);
    const newDoctor = new Doctor({
      name,
      id: doctorId,
      username,
      password: hashedPassword,
      role,
      contactNumber,
      availability,
    });

    await newDoctor.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: doctorId, username, role },
      Secret_Key, // Ensure Secret_Key is properly configured
      { expiresIn: "7d" }
    );

    res
      .status(201)
      .json({ message: "Doctor created successfully", data: token });
  } catch (error) {
    res.status(500).json({ error: "Unexpected Error Occurred" });
    next(`ERROR IN: signupDoctor function => ${error.message}`);
    console.error(error.message);
  }
};

// Function to login a Doctor
const loginDoctor = async (req, res, next) => {
  try {
    console.log("Doctor Login Request Body:", req.body);
    const { username, password } = req.body;

    if (!username || !validator.isAlphanumeric(username)) {
      return res.status(400).json({ error: "Valid username is required" });
    }
    if (!password || password.length < 8) {
      return res
        .status(400)
        .json({ error: "Password must be at least 8 characters long" });
    }

    const doctor = await Doctor.findOne({ username });
    if (!doctor) {
      return res.status(400).json({ error: "Invalid username" });
    }
    if (!(await bcrypt.compare(password, doctor.password))) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        name: doctor.name,
        username: doctor.username,
        role: doctor.role,
        id: doctor.id,
      },
      Secret_Key,
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: `Welcome ${doctor.name}`, data: token });
  } catch (error) {
    console.error("Error in loginDoctor:", error);
    res.status(500).json({ error: "Unexpected Error Occurred" });
    next(`ERROR IN: loginDoctor function => ${error}`);
  }
};

//logout
const logoutdoctor = async (req, res, next) => {
  try {
    res.status(201).json({ message: "Logged out successfully" });
  } catch (err) {
    res.status(404).json({ error: "Unexpected Error Occurred" });
    next(`ERROR IN: Logout Function => ${err}`);
  }
};
// Player CRUD operations
const addPlayerD = async (req, res) => {
  try {
    const player = new Player(req.body);
    await player.save();
    res.status(200).json(player);
  } catch (error) {
    res.status(400).json(`ERROR IN: addPlayerD function => ${error}`);
  }
};
const deletePlayerD = async (req, res) => {
  try {
    const playerId = req.params.playerId;
    await Player.findByIdAndDelete(playerId);
    res.status(200).json({ message: "Player deleted successfully" });
  } catch (error) {
    res.status(400).json(`ERROR IN: DeletePlayerD function => ${error}`);
  }
};

const editPlayerD = async (req, res) => {
  try {
    const playerId = req.params.playerId;
    const updatedPlayer = req.body;
    await Player.findByIdAndUpdate(playerId, updatedPlayer, { new: true });
    res.status(200).json(updatedPlayer);
  } catch (error) {
    res.status(400).json(`ERROR IN: updatePlayer function => ${error}`);
  }
};

module.exports = {
  addPlayerD,
  deletePlayerD,
  editPlayerD,
  signupDoctor,
  loginDoctor,
  logoutdoctor,
};
