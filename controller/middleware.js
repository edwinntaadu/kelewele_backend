require("dotenv").config(); // loading env variables
const jwt = require("jsonwebtoken");
const  SECRET_KEY  = process.env.SECRET_KEY;

// MIDDLEWARE FOR AUTHORIZATION (MAKING SURE THEY ARE LOGGED IN)
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.error("Authorization header is missing or invalid:", authHeader);
    return res.status(401).json({ message: "Access token is missing or invalid" });
  }

  const token = authHeader.split(" ")[1];
  

  console.log("Verification SECRET_KEY:", process.env.SECRET_KEY);
  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) {
      console.error("Token verification error:", err); // Log the error
      return res.status(403).json({ message: err.message});
    }
    console.log("Decoded token:", user); // Log the decoded token
    req.user = user;
    next();
  }); 
};

// export custom middleware
module.exports = {
  authenticateToken,
};