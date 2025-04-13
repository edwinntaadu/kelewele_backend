const { Router } = require("express"); 
const authMiddleware = require("../middleware"); 

require("dotenv").config(); 
const {User, Verification, EmailPassReset, PhonePassReset, Session} = require("../../models/user_auth"); 
const UserProfile = require("../../models/user_profile")
const bcrypt = require("bcryptjs"); 
const jwt = require("jsonwebtoken"); 
const twilio = require('twilio');
const nodemailer = require('nodemailer');

const router = Router();

const authenticateToken = require("../middleware").authenticateToken; // Import the middleware

router.get("/getProfileInformation", authenticateToken, async (req, res) => {

    try {
      console.log("Request Headers:", req.headers); // Log the request headers
        const userId = req.user.userId; // Extract userId from the decoded token
        console.log("User ID from token:", userId);
        const userProfile = await UserProfile.findOne({ userID: userId });
    
        if (!userProfile.email) {
          return res.status(404).json({ message: "User profile not found" });
        }
    
        res.status(200).json({ profile: userProfile }); 
      } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ message: error.message });
      }
});

router.post("/updateProfileInformation", authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId; // Extract userId from the decoded token
        console.log("User ID from token:", userId);
        const { username, phoneNumber, addresses, preferences } = req.body;
    
        // Update the user profile in the database
        const updatedProfile = await UserProfile.findOneAndUpdate(
            { userID: userId },
            { username, phoneNumber, addresses, preferences },
            { new: true }
        );
    
        if (!updatedProfile) {
            return res.status(404).json({ message: "User profile not found" });
        }
    
        res.status(200).json({ message: "Profile updated successfully", profile: updatedProfile });
    } catch (error) {
        console.error("Error updating user profile:", error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;