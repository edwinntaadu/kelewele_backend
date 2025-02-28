require("dotenv").config(); 
const { Router } = require("express"); 
const {User, Verification} = require("../models/user_auth"); 
const UserProfile = require("../models/user_profile")
const bcrypt = require("bcryptjs"); 
const jwt = require("jsonwebtoken"); 
const twilio = require('twilio');


const router = Router();

const { SECRET = "secret" } = process.env;

// Signup route to create a new user
router.post("/signup", async (req, res) => {
  try {
    // hash the password
    req.body.password = await bcrypt.hash(req.body.password, 10);
    const user = await User.create(req.body);
    // send new user as response

    //Also create User Profile
    const userProfile = await UserProfile.create({
      "email":user.email,
      "username":user.username,
      "userID":user.id,
      "phoneNumber":""
    });

    res.json({ user, userProfile });
  } catch (error) {
    res.status(400).json({ error });
  }
});


// Login route to verify a user and get a token
router.post("/login", async (req, res) => {
  try {
    // check if the user exists
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      //check if password matches
      const result = await bcrypt.compare(req.body.password, user.password);
      if (result) {
        // sign token and send it in response
        const token = await jwt.sign({ email: user.email }, SECRET);
        res.json({ token });
      } else {
        res.status(400).json({ error: "password doesn't match" });
      }
    } else {
      res.status(400).json({ error: "User doesn't exist" });
    }
  } catch (error) {
    res.status(400).json({ error });
  }
});

//Verification of account phone number
// Generate Random Verification Code
const generateVerificationCode = () => Math.floor(1000 + Math.random() * 9000).toString();

// Twilio Client
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Route: Send Verification Code
router.post('/send-code_to_phone', async (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ error: 'Phone number is required' });

  try {
    const code = generateVerificationCode();
    // Save to DB
    await Verification.create({ phone, code });

    // Send SMS
    /* await twilioClient.messages.create({
      body: `Your Kelewele verification code is: ${code}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    }); */

    res.status(200).json({ message: 'Verification code sent successfully', code:100 });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send verification code' });
  }
});

// Route: Verify Code
router.post('/verify-code', async (req, res) => {
  const { phone, code, id } = req.body;
  if (!phone || !code) return res.status(400).json({ error: 'Phone number and code are required' });

  try {
    const record = await Verification.findOne({ phone:phone, code: code });
    console.log(JSON.stringify(record))
    if (!record) return res.status(400).json({ error: 'Invalid code or phone number' });

    //Make entry into User Profile
    const result = await UserProfile.updateOne(
      { _id: id }, 
      { $set: { phoneNumber: phone } });

      const res = await result.json();
      console.log("Updated"+JSON.stringify(res))
    
    //Verification successful, you can delete the record
    await Verification.deleteOne({ _id: record._id });

    res.status(200).json({ message: 'Phone number verified successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Verification failed' });
  }
});


//Feth Profile Information


module.exports = router