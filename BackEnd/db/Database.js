const { v4 } = require("uuid");
const mongoose = require("mongoose");
// Connect to MongoDB (Local)
mongoose
.connect("mongodb://localhost:27017/performance-tracker")
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.log(err));
  // Create the User model
const User = mongoose.model(
    "User",
    new mongoose.Schema(
        {
            name: { type: String, required: true },
            id: { type: String, required: true },
            gender: {
                type: String,
                enum: ["Male", "Female"],
                required: true,
            },
            weight: { type: Number, required: true },
            height: { type: Number, required: true },
            age: { type: Number, required: true }
        }
    )
);
module.exports = {
    User}