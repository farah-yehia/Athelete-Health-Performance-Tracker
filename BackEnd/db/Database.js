const { v4, stringify } = require("uuid");
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
  number: { type: String, required: true },
  weight: { type: String, required: true },
  height: { type: String, required: true },
  age: { type: Number, required: true },
  team: { type: String, required: true }, // Team name
  img: { type: String, default: "" },
  healthMetrics: {
    heartRate: { type: Number }, // Real-time heart rate data
    distanceCovered: { type: Number }, // Distance in kilometers
    lastUpdated: { type: Date, default: Date.now }, // Timestamp of last update
  },
  role: { type: String, default: "player" },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" }, // Array of linked doctors one to many
  comments: [
    {
      doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
      note: { type: String },
      date: { type: Date, default: Date.now },
    },
  ], //section where doctors can leave notes
});
const Player = mongoose.model("Player", playerSchema);
// Doctor Schema
const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Doctor's name
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  id: { type: String, required: true },
  contactNumber: { type: String, required: true }, // Doctor's phone number
  availability: {
    days: [
      {
        type: String,
        enum: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
      },
    ],
    time: { start: { type: String }, end: { type: String } }, // Time range the doctor is available
  },
  role: { type: String, default: "doctor" },
});
const Doctor = mongoose.model("Doctor", doctorSchema);
// Admin Schema
const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  id: { type: String, required: true },
  role: { type: String, default: "admin" }, // Role can be used for access control
});
const Admin = mongoose.model("Admin", adminSchema);
// Export the models
module.exports = { Player, Doctor, Admin };
