const express = require("express");
const {
  addPlayerD,
  deletePlayerD,
  editPlayerD,
  signupDoctor,
  loginDoctor,
  logoutdoctor,
} = require("../controller/Doctor");
const verifyToken = require("../controller/VerifyToken");

const router = express.Router();

// Routes for doctor functionalities
router.post("/add-player-D", verifyToken("doctor"), addPlayerD);
router.delete(
  "/delete-player-D/:playerId",
  verifyToken("doctor"),
  deletePlayerD
);
router.put("/edit-player-D/:playerId", verifyToken("doctor"), editPlayerD);

// Doctor authentication routes
router.post("/doctors/signup", signupDoctor);
router.post("/login", loginDoctor);
router.post("/logout", logoutdoctor);

module.exports = router;
