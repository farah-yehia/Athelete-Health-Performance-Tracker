const {Admin,Doctor,Player} = require("../db/Database");
const { v4 } = require("uuid");
const bcrypt=require("bcrypt")
const validator = require("validator");
const jwt = require("jsonwebtoken");
const ENV =require("../env")
// Function to add a Admin
const getAdmin = async (req, res, next) => {
    try {
        const { id } = req.params; // Use req.params instead of req.body
        const admin = await Admin.findOne({ id });
        if (!admin) {
            return res.status(404).json({ error: "admin not found" })
        }
        else{
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
        return res.status(404).json({ message: "User not found" });
    }
    res.status(200)
        .json({ message: `Admin (${admin.name}) deleted successfully` });
    } catch (error) {
    res.status(500).json({ error: "Unexpected Error Occurred" }); 
    next(`ERROR IN: deleteUser function => ${error}`);
}
};

// Function to edit Admin details
const editAdmin= async (req, res, next) => {
    try {
    const { id } = req.params;
    const sentAdmin = req.body;
    const admin = await Admin.findOne({ id });
    if (!admin) {
        return res.status(404).json({ error: "Admin not found" });
    }
    const checkUsername = await Admin.findOne({ username: sentAdmin.username });
    if (checkUsername && checkUsername.id !== id) {
        return res.status(404).json({ error: "Username already exists" });
    }
    admin.name = sentAdmin.name;
    admin.username = sentAdmin.username;
    admin.role=sentAdmin.role;
    await admin.save();
    const token = await jwt.sign(
        sentAdmin,
        ENV.Secret_Key
    )

    res.status(201).json({
      message: `admin (${admin.name}) updated successfully`,
      data: token
    });
  } catch (error) {
    res.status(200).json({ error: "Unexpected Error Occurred" });
    next(`ERROR IN: updateAdmin function => ${error}`);
  }
};

//Function to allow a Admin to create an account (signup)
const signupAdmin = async (req, res, next) => {
    const validAdminIDs = ["ADMIN123", "SUPERADMIN456", "30705020901981"];
        // Check if the provided adminID is valid
 
    try {
        const { name,username, password, role ,id} = req.body;
        console.log(req.body)
        // const id = v4();
        if (!validator.isLength(name, { min: 3 })) {
        return res.status(400).json({ error: "Name must be at least 3 characters long" });
    }
    if (!validator.isAlphanumeric(username)) {
        return res.status(400).json({ error: "Username must be alphanumeric" });
    }
    if (!validator.isStrongPassword(password, { minLength: 8 })) {
        return res.status(400).json({ error: "Password must be strong and at least 8 characters long" });
    }
    if (!["admin", "doctor", "player"].includes(role)) {
        return res.status(400).json({ error: "Invalid role" });
    }
    if (await Admin.findOne({ username: username })) {
        return res.status(400).json({ error: "Username already exists" });
    }
    if (role!=="admin") {
        return res.status(400).json({ error: "Only admin role allowed here" });
    }
     if (!validAdminIDs.includes(id)) {
    return res.status(403).json({ message: "Unauthorized admin ID" });
  }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({
        name,
        id,
        username,
        password: hashedPassword,
        role,
    });
    await newAdmin.save();
    res.status(201).json({ message: "Admin created successfully", data: newAdmin });
} catch (error) {
    res.status(400).json({ error: "Unexpected Error Occurred" });
    next(`ERROR IN: signup function => ${error}`);
}
};

// Function to login an Admin
const loginAdmin =async (req, res, next) => {
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
        const admin = await Admin.findOne({ username });
        if (!admin) {
            return res.status(404).json({ error: "Invalid username" });
        } else if (!(await bcrypt.compare(password, admin.password))) {
            return res.status(404).json({ error: "Invalid password" });
        } else {
            const token = await jwt.sign(
        {
            name: admin.name,
            username:admin.username,
            role:admin.role,
            password:admin.password
        },
        ENV.Secret_Key,
        { expiresIn: "1h" }
    );
    res.status(201).json({ message: `Welcome ${admin.name}`, data: token });
    }
} catch (error) {
    res.status(404).json({ error: "Unexpected Error Occurred" });
    next(`ERROR IN: login function => ${error}`);
}
};
//logout
const logout=async (req, res, next) => {
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
        res.status(400).json( `ERROR IN: addPlayer function => ${error}`);
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

// Doctor CRUD operations
const addDoctor = async (req, res) => {
    try {
        const doctor = new Doctor(req.body);
        await doctor.save();
        res.status(200).json(doctor);
    } catch (error) {
        res.status(400).json(`ERROR IN: addDoctor function => ${error}`);
    }
};

const deleteDoctor = async (req, res) => {
    try {
        const doctorId = req.params.doctorId;
        await Doctor.findByIdAndDelete(doctorId);
        res.status(200).json({ message: "Doctor deleted successfully" });
    } catch (error) {
        res.status(400).json(`ERROR IN: deleteDoctor function => ${error}`);
    }
};

const updateDoctor = async (req, res) => {
    try {
        const doctorId = req.params.doctorId;
        const updatedDoctor = req.body;
        await Doctor.findByIdAndUpdate(doctorId, updatedDoctor, { new: true });
        res.status(200).json(updatedDoctor);
    } catch (error) {
        res.status(400).json(`ERROR IN: updateDoctor function => ${error}`);
    }
};

module.exports = { getAdmin, deleteAdmin, editAdmin ,signupAdmin, loginAdmin,
    addPlayer,deletePlayer,updatePlayer,addDoctor,deleteDoctor,updateDoctor,logout };
