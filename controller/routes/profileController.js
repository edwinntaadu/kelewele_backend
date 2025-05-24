const { Router } = require("express"); 
const authMiddleware = require("../middleware"); 

require("dotenv").config(); 
const {User, Verification, EmailPassReset, PhonePassReset, Session} = require("../../models/user_auth"); 
const UserProfile = require("../../models/user_profile")
const bcrypt = require("bcryptjs"); 
const jwt = require("jsonwebtoken"); 
const twilio = require('twilio');
const nodemailer = require('nodemailer');
//import { populateSellers } from "./helper_function/populate_sellers"; // Import the populateSellers function
//const { populateMeals } = require("./helper_function/populate_meals"); // Import the populateMeals function
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

       //await populateMeals(); // Call the populateSellers function with userProfile
        //populateMeals(); // Call the populateMeals function with userProfile
    
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
        const {updatedAddress} = req.body;

        console.log("Request Body2:", req.body); // Log the request body
    
        // Update the user profile in the database
        const updatedProfile = await UserProfile.findOneAndUpdate(
          { userID: userId },
          { 
              $set: { updatedAddress } // Use $set to update only the addresses field
          },
          { new: true } // Return the updated document
      );
    
        if (!updatedProfile) {
            return res.status(404).json({ message: "User profile not found" });
        }

        console.log("Updated Profile:", updatedProfile); // Log the updated profile
    
        res.status(200).json({ message: "Profile updated successfully", profile: updatedProfile });
    } catch (error) {
        console.error("Error updating user profile:", error);
        res.status(500).json({ message: error.message });
    }
});

router.post("/addAddress", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId; // Extract userId from the decoded token
    console.log("User ID from token:", userId);

    const { updatedAddress } = req.body; // Extract updatedAddress from the request body
    console.log("Updated Address from request body:", updatedAddress); // Log the updated address

    // Validate that updatedAddress is provided and is an array
    if (!updatedAddress) {
        return res.status(400).json({ message: "Invalid or missing updatedAddress field" });
    }

    // Validate that updatedAddress is provided and is an array
    if (!Array.isArray(updatedAddress)) {
      return res.status(400).json({ message: "Invalid or missing updatedAddress field2" });
  }

    // Update the addresses array in the user profile
    const updatedProfile = await UserProfile.findOneAndUpdate(
        { userID: userId },
        { 
            $set: { addresses: updatedAddress } // Use $set to update the addresses array
        },
        { new: true } // Return the updated document
    );

    if (!updatedProfile) {
        return res.status(404).json({ message: "User profile not found" });
    }

    console.log("Updated Profile:", updatedProfile); // Log the updated profile

    res.status(200).json({ message: "Addresses updated successfully", profile: updatedProfile });
} catch (error) {
    console.error("Error updating addresses:", error);
    res.status(500).json({ message: error.message });
}
});

module.exports = router;