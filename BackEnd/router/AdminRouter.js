
// const {addPlayer, deletePlayer, updatePlayer, addDoctor, deleteDoctor, updateDoctor, getAdmin, deleteAdmin,
//     editAdmin, signupAdmin, loginAdmin } = require("../controller/Admin");
const express = require("express");
const controller=require("../controller/Admin")
const verifyToken = require("../controller/VerifyToken");
const router =express.Router()

// Routes for Player functionalities
router.post("/players", verifyToken("admin"),controller.addPlayer);
router.delete("/players/:playerId", verifyToken("admin"), controller.deletePlayer);
router.put("/players/:playerId", verifyToken("admin"), controller.updatePlayer);

// Routes for Doctor functionalities
router.post("/doctors", verifyToken("admin"), controller.addDoctor);
router.delete("/doctors/:doctorId", verifyToken("admin"), controller.deleteDoctor);
router.put("/doctors/:doctorId", verifyToken("admin"), controller.updateDoctor);
// Routes for Admin functionalities
router.get("/admins/:id", verifyToken("admin"), controller.getAdmin);
router.delete("/admins/:id", verifyToken("admin"), controller.deleteAdmin);
router.put("/admins/:id", verifyToken("admin"),controller.editAdmin);

// Admin authentication routes
router.post("/admins/signup",controller.signupAdmin);
router.post('/admins/login',controller.loginAdmin);
router.post('/admins/logout',controller.logout);
//fetchLeagues
router.get("/api/leagues",controller.fetchLeagues);


module.exports = router;
