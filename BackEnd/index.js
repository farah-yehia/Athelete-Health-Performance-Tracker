const express = require("express");
const app = express();
const db = require("./db/Database");
const ENV = require("./env");
const port = ENV.Back_Port;
const verifyToken=require("./controller/VerifyToken")
const jwt = require("jsonwebtoken");
const { rateLimit } = require("express-rate-limit");
const limiter = rateLimit({
    windowMs: 15 * 60 * 100000,
    max: 100000,
    message: "Too many requests from this IP, please try again after 15 minutes",
});


// Middleware to parse JSON request bodies
app.use(express.json());

app.use(limiter);

const cors = require("cors");

// Middleware to allow requests from other origins
app.use(
    cors({
        origin: ENV.Front_Origin, // Allow all origins during development
        methods: "GET,HEAD,PUT,POST,DELETE",
        credentials: true,
        // allowedHeaders: ["Content-Type", "Authorization"],
    })
);

// Importing routers
const AdminRouter = require("./router/AdminRouter");
const DoctorRouter = require("./router/DoctorRouter");
const PlayerModel = require("./controller/Player"); 


// Linking routers to the app
app.use(AdminRouter);
app.use(DoctorRouter);
app.use(PlayerModel)


// //for testing
// app.get("/test", verifyToken("doctor"), (req, res) => {
//     console.log(req.headers)
// const availabilityDays = req.doctor.availability.days;
//   const availabilityTimeStart = req.doctor.availability.time.start;
//   const availabilityTimeEnd = req.doctor.availability.time.end;
//   res.json({test: `Hello Doctor ${req.doctor.name} your phone number is ${req.doctor.contactNumber} 
//     and your available day is in ${availabilityDays} and at time  from${availabilityTimeStart} `});
// })

// async function name() {
   
//     const token = await jwt.sign(
//         {
//           name: "farah",
//       role: "doctor",
//       contactNumber: "0109995851",
//       availability: {
//         days: ["Monday", "Friday"], // Ensure this is an array
//         time: { start: "2:00 pm", end: "5:00 pm" } // Correctly format time
//       }
//         },
//        ENV.Secret_Key,
//         { expiresIn: "1h" }
//       );
//     console.log(token)
     
// }
// name()

// Middleware to monitor requests and responses
app.use((req, res, next) => {
    console.log();
    console.warn("------------------------------------------------------");
    console.log(`Request URL: ${req.url}, Request Method: ${req.method}`);
    console.warn("------------------------------------------------------");
    console.log();
    next();
});

// Middleware to catch any errors
app.use((err, req, res, _) => {
    console.warn("------------------------------------------------------");
    console.error(err);
    console.warn("------------------------------------------------------");
    console.log();
    res.end();
});

// Middleware to catch any requests to non-existing routes
app.all("*", (req, res) => {
    return res.status(400).json({ error: "Wrong Path" });
});

// Starting the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

module.exports = app;