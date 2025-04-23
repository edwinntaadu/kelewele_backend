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

// Dummy Data
const dummyFoods = [
  {
    id: 1,
    name: "Waakye",
    image: "img/list/waakye.jpg",
    category: "Healthy",
    badgeClass: "bg-info-subtle text-info",
    deliveryTime: 24,
    rating: 4.8,
    price: 12,
    description: "a Ghanaian dish of cooked rice and beans"
  },
  {
    id: 2,
    name: "Fufu",
    image: "img/list/fufu.jpg",
    category: "Tranding",
    badgeClass: "bg-danger-subtle text-danger",
    deliveryTime: 34,
    rating: 4.9,
    price: 19,
    description: "Ghanaian special"
  }
];

const dummyRestaurants = [
  {
    id: 1,
    name: "street Kitchen",
    image: "img/list/restaurant1.avif",
    rating: 4.8,
    deliveryTime: 24,
    cuisine: "Healthy Food",
    address: "123 Main St, California"
  },
  {
    id: 2,
    name: "Kanzo Paradise",
    image: "img/list/restaurant2.avif",
    rating: 4.9,
    deliveryTime: 30,
    cuisine: "Italian",
    address: "456 Oak Ave, California"
  }
];


// Middleware
// app.use(cors());

app.use(cors({
  origin: "http://localhost:5500",
  credentials: true
}));

app.use('/img', express.static("img"));
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

// Food Search Endpoint
app.get("/api/foods", (req, res) => {
  const searchTerm = req.query.search?.toLowerCase() || "";
  const filtered = dummyFoods.filter(food => 
    food.name.toLowerCase().includes(searchTerm) ||
    food.description.toLowerCase().includes(searchTerm)
  );
  res.json(filtered);
});

// Restaurant Search Endpoint
app.get("/api/restaurants", (req, res) => {
  const searchTerm = req.query.search?.toLowerCase() || "";
  const filtered = dummyRestaurants.filter(restaurant => 
    restaurant.name.toLowerCase().includes(searchTerm) ||
    restaurant.cuisine.toLowerCase().includes(searchTerm)
  );
  res.json(filtered);
});

app.use("/user", UserRouter);
app.use("/auth", authRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running... on port ${PORT}`);
});
