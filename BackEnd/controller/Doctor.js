const {Player, Doctor} = require("../db/Database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ENV = require("../env");
const validator = require("validator");
const { v4 } = require("uuid");
//Function to allow for a Player to create an account (signup)
const signupPlayer = async (req, res, next) => {
    try {
    const { name,username, password, role,contactNumber,availability} = req.body;
    console.log(req.body)
    const id = v4();
    if (!validator.isLength(name, { min: 3 })) {
        return res.status(400).json({ error: "Name must be at least 3 characters long" });
    }
    if (!validator.isAlphanumeric(username)) {
        return res.status(400).json({ error: "Username must be alphanumeric" });
    }
    if (!validator.isStrongPassword(password, { minLength: 8 })) {
        return res.status(400).json({ error: "Password must be strong and at least 8 characters long" });
    }
    if (["player","admin"].includes(role)) {
        return res.status(400).json({ error: "Invalid role" });
    }
    if (await Doctor.findOne({ username: username })) {
        return res.status(400).json({ error: "Username already exists" });
    }
    if (!role) {
        return res.status(400).json({ error: "Role is required" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newDoctor = new Doctor({
        name,
        id,
        username,
        password: hashedPassword,
        role,
        contactNumber,
        availability
    });
    await newDoctor.save();
    res.status(201).json({ message: "doctor created successfully", data: newDoctor });
} catch (error) {
    res.status(400).json({ error: "Unexpected Error Occurred" });
    next(`ERROR IN: signup function => ${error}`);
}
};

// Function to login Player
const loginPlayer =async (req, res, next) => {
    try {
        console.log("req is => " , req.body)
        const { username, password } = req.body;
        // Validate the username
        if (!username || !validator.isAlphanumeric(username)) {
            return res.status(400).json({ error: "Valid username is required" });
    }
    if (!password || !validator.isLength(password, { min: 8 })) {
        return res.status(400).json({ error: "Password must be at least 8 characters long" });
    }
        const doctor = await Doctor.findOne({ username });
        if (!doctor) {
            return res.status(404).json({ error: "Invalid username" });
        } else if (!(await bcrypt.compare(password, doctor.password))) {
            return res.status(404).json({ error: "Invalid password" });
        } else {
            const token = await jwt.sign(
        {
            name: doctor.name,
            username:doctor.username,
            role:doctor.role,
            password:doctor.password,
            contactNumber:doctor.contactNumber,
            availability:doctor.availability
        },
        ENV.Secret_Key,
        { expiresIn: "1h" }
    );
    res.status(201).json({ message: `Welcome ${doctor.name}`, data: token });
    }
} catch (error) {
    res.status(404).json({ error: "Unexpected Error Occurred" });
    next(`ERROR IN: login function => ${error}`);
}
};
//logout
const logoutdoctor=async (req, res, next) => {
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
        res.status(400).json( `ERROR IN: addPlayerD function => ${error}`);
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

module.exports = { addPlayerD, deletePlayerD, editPlayerD,signupPlayer, loginPlayer,logoutdoctor };
