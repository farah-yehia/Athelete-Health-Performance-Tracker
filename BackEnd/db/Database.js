const { v4 } = require("uuid");
const mongoose = require("mongoose");
// Connect to MongoDB [locally]
mongoose
.connect("mongodb://localhost:27017/performance-tracker")
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.error("Connection error", err));

// Player Schema
const playerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    id: { type: String, required: true },
    gender: { type: String, enum: ["Male", "Female"], required: true },
    weight: { type: Number, required: true },
    height: { type: Number, required: true },
    age: { type: Number, required: true },
   team: { type: String, required: true }, // Team name or ID the player belongs to
   image: { type: String, default: "" }, // URL of the player's image
   healthMetrics: {
    heartRate: { type: Number }, // Real-time heart rate data
    distanceCovered: { type: Number }, // Distance in kilometers
    lastUpdated: { type: Date, default: Date.now }, // Timestamp of last update
    },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" }, // Link to assigned doctor
    ecgData: [
        {
            voltage: { type: Number }, // Voltage reading
            timestamp: { type: Date } // Time of the reading
            }
        ]
    });
    const Player = mongoose.model("Player", playerSchema);
    // Doctor Schema
    const doctorSchema = new mongoose.Schema({ name: { type: String, required: true }, // Doctor's name
        specialization: { type: String, required: true }, // Area of expertise
        username: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        players: [{ type: mongoose.Schema.Types.ObjectId, ref: "Player" }], // Array of linked players
        contactNumber: { type: String, required: true }, // Doctor's phone number
        });
        const Doctor = mongoose.model("Doctor", doctorSchema);
        // Admin Schema
        const adminSchema = new mongoose.Schema({
            name: { type: String, required: true },
            username: { type: String, required: true, unique: true },
            password: { type: String, required: true },
            role: { type: String, default: "admin" }, // Role can be used for access control
            });
            const Admin = mongoose.model("Admin", adminSchema);
            // Export the models
            module.exports = { Player, Doctor,Admin};