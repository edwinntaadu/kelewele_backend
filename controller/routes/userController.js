require("dotenv").config(); 
const { Router } = require("express"); 
const {User, Verification, EmailPassReset, PhonePassReset, Session} = require("../../models/user_auth"); 
const UserProfile = require("../../models/user_profile")
const bcrypt = require("bcryptjs"); 
const jwt = require("jsonwebtoken"); 
const twilio = require('twilio');
const nodemailer = require('nodemailer');




const router = Router();

const SECRET_KEY  = process.env.SECRET_KEY;


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
    const { email, password } = req.body;
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
 
    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: "1d" });



    console.log("Generated token:", process.env.SECRET_KEY); // Log the generated token
    // Save session in DB
    await Session.create({ userId: user._id, token });

    res.json({ token });
  } catch (error) {
    res.status(400).json({ error });
  }
});

//Verification of account phone number
// Generate Random Verification Code
const generateVerificationCode = () => Math.floor(1000 + Math.random() * 9000).toString();

// Twilio Client
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Nodemailer Transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Function to send email
async function sendEmail(to, subject, text) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: to,
    subject: subject,
    text: text
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

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
router.post("/verify-code", async (req, res) => {
  try {
      const { phone, code, id } = req.body;

      // Declare and initialize `record` before using it
      const record = await Verification.findOne({ phone, code, id });

      if (!record) {
          return res.status(400).json({ message: "Verification failed. Invalid code or phone number." });
      }

      if (record.isVerified) {
          return res.status(400).json({ message: "Phone number is already verified." });
      }

      // Mark the record as verified
      record.isVerified = true;
      await record.save();
      return res.status(200).json({ message: "Phone number verified successfully", code: 100 });

  } catch (error) {
      console.error("Error during verification:", error);
      return res.status(500).json({ message: "An error occurred during verification." });
  }
});

router.post("/email_verification_reset-password", async (req, res) => {

  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  try {
    const code = generateVerificationCode();
    // Save to DB
    await PasswordResetVerification.create({ email, code });

    // Send Email
    //await sendEmail(email, 'Password Reset Verification Code', `Your verification code is: ${code}`);

    res.status(200).json({ message: `Verification code sent successfully ${code}`, code: 100 });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send verification code' });
  }
});

router.post("/phone_verification_reset-password", async (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ error: 'Phone number is required' });

  try {
    const code = generateVerificationCode();
    // Save to DB
    await PasswordResetVerification.create({ email: phone, code });

    alert (`Your verification code is: ${code}`) ;

    res.status(200).json({ message: `Verification code sent successfully ${code}`, code: 100 });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send verification code' });
  }
});


router.post("/logout", async (req, res) => {
  console.log("Logout request received:"); // Log the request body
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ message: "No token provided" });

    // Delete session from DB
    await Session.deleteOne({ token });

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ error });
  }
});


module.exports = router