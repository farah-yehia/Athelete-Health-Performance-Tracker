const express = require("express");
const app = express();
const db=require("./db/Database")
const ENV = require("./env");
const port = ENV.Back_Port;
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
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        credentials: true,
        // allowedHeaders: ["Content-Type", "Authorization"],
        })
    );
    // Importing routers
    // const UserRouter = require("./router/UserRouter");


// Middleware to monitor requests and responses
app.use((req, res, next) => {
    console.log();
    console.warn("------------------------------------------------------");
    console.log(`Request URL: ${req.url}, Request Method: ${req.method}`);
    console.warn("------------------------------------------------------");
    console.log();
    next();
});

// Linking routers to the app
// app.use(UserRouter);


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
    return res.status(200).json({ error: "Wrong Path" });
});

// Starting the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

module.exports = app;
