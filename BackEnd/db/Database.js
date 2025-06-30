const { v4, stringify } = require("uuid");
const mongoose = require("mongoose");

// Connect to MongoDB Atlas
mongoose
  .connect(
    "mongodb+srv://web-server:nBMyhMcZKGxi2rg@cluster0.nkbwbr9.mongodb.net/performance-tracker?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("Connection error", err));
// mongoose
//   .connect("mongodb://localhost:27017/performance-tracker")
//   .then(() => console.log("Connected to MongoDB"))
//   .catch((err) => console.log(err));

// Player Schemamongoose
const playerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  weight_kg: { type: Number, required: true },
  duration_minutes: { type: Number },
  intensity: { type: String },
  bmi: { type: Number },
  vo2_max: { type: Number },
  calories: { type: Number },
  steps: { type: Number },
  heartRate: { type: Number }, // AI-predicted HR
  MheartRate: { type: Number }, // Hardware-measured HR
  avg_heart_rate: { type: Number },
  distance: { type: Number }, // Covered distance (km)
  maxPlayTime: { type: Number }, //  Predicted playing time from AI model (in minutes)
  lastUpdated: { type: Date, default: Date.now },
  team: { type: String },
  img: { type: String },
  role: { type: String, default: "player" },
  comments: [
    {
      doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
      note: { type: String },
      date: { type: Date, default: Date.now },
    },
  ],
});

const Player = mongoose.model("Player", playerSchema);
// Doctor Schema
const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  id: { type: String, required: true, unique: true },
  contactNumber: { type: String, required: true },
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
    time: { start: { type: String }, end: { type: String } },
  },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  role: { type: String, default: "doctor" },
});
const Doctor = mongoose.model("Doctor", doctorSchema);

// Admin Schema
const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  id: { type: String, required: true, unique: true },
  role: { type: String, default: "admin" },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
});
const Admin = mongoose.model("Admin", adminSchema);

// Export the models
module.exports = { Player, Doctor, Admin };
