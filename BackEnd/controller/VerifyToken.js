const {Secret_Key}=require('../env');
const {verify} = require("jsonwebtoken");
const jwt = require("jsonwebtoken");
// Middle ware to verify person if it is authorized or not to join route
const VerifyTokenForAdmin = async (req, res, next) => {
    const authorization = req.headers["authorization"];
    if (!authorization) {
    res.status(401).json({ error: "You must login first" });
    next("ERROR IN: VerifyTokenForAdmin function => Token is required");
    return;
}
try {
    let decoded = jwt.verify(authorization, Secret_Key); // change decode to authorization
    decoded.role = decoded.role.toLowerCase();
    if (decoded.role === "admin") {
        req.admin = decoded;
        next();
    } else {
        res.status(403).json({ error: "You are not authorized" });
        next("ERROR IN: VerifyTokenForAdmin function => Invalid role");
    }
} catch (error) {
    if (error.name === "TokenExpiredError") {
        res.status(403).json({ error: "Session Expired, please login again" });
        
    }
    else
    {
        res.status(403).json({ error: "Invalid credentials" });
    }
    next(`ERROR IN: VerifyTokenForAdmin function => ${error}`);
}
};
const VerifyTokenForDoctor = async (req, res, next) => {
    const authorization = req.headers["authorization"];
    if (!authorization) {
        res.status(401).json({ error: "You must login first" });
        next("ERROR IN: VerifyTokenForDoctor function => Token is required");
        return;
    }
    try {
        let decoded = jwt.verify(authorization, Secret_Key); // change decode to authorization
        decoded.role = decoded.role.toLowerCase();
        if (decoded.role === "doctor") {
            req.doctor = decoded
            next();
        }
        else
        {
            res.status(403).json({ error: "You are not authorized" });
            next("ERROR IN: VerifyTokenForDoctor function => Invalid role");
        }
    } catch (error) {
    if (error.name === "TokenExpiredError") {
        res.status(403).json({ error: "Session Expired, please login again" });
        
    }
    else
    {
        res.status(403).json({ error: "Invalid credentials" });
    }
    next(`ERROR IN: VerifyTokenForDoctor function => ${error}`);
}
};

function verifyToken (role) {
role = role.toLowerCase().replaceAll(" ", "");
if (role === "admin") {
    return VerifyTokenForAdmin;
} else if (role === "doctor") {
    return VerifyTokenForDoctor;
}
}

module.exports = verifyToken;

