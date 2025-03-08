require("dotenv").config(); // Load .env variables
const express = require("express"); // Import express
const morgan = require("morgan"); // Import morgan
const { log } = require("mercedlogger"); // Import mercedlogger's log function
const cors = require("cors"); // Import cors
const session = require("express-session");
const passport = require("passport");
const UserRouter = require("./controller/userController"); // Import User Routes
const authRoutes = require("./routes/authRoutes");
require("./config/passport"); // Import Passport configuration

const { PORT = 3000 } = process.env;

// Initialize Express App
const app = express();

// Middleware
app.use(cors());
app.use(morgan("tiny"));
app.use(express.json());

app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get("/", (req, res) => {
  res.send("Express Server up and running...,,,!");
});

app.use("/user", UserRouter);
app.use("/auth", authRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running... on port ${PORT}`);
});
