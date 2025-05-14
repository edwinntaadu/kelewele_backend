

require("dotenv").config() // load .env variables
const express = require("express") // import express
const morgan = require("morgan") //import morgan
const {log} = require("mercedlogger") // import mercedlogger's log function
const cors = require("cors") // import cors
const UserRouter = require("./controller/routes/userController") //import User Routes
const ProfileRouter = require("./controller/routes/profileController") //import Profile Routes
const MealsRouter = require("./controller/routes/mealsController") //import Meals Routes
const SellersRouter = require("./controller/routes/sellersController") //import Sellers Routes

const {PORT = 3000} = process.env

// Example using the http module
const app = express();
app.use(cors());
app.use(morgan("tiny")) 
app.use(express.json()) 


// Making Routes
app.get('/', (req, res) => {
    res.send('Express Server up and running!');
});

app.use("/user", UserRouter)
app.use("/profile", ProfileRouter)
app.use("/meals", MealsRouter)
app.use("/sellers", SellersRouter)

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


/*   async function run() {
    try {
      // Connect the client to the server	(optional starting in v4.7)
      await client.connect();
      // Send a ping to confirm a successful connection
      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to Database!");
    } finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }
  }
  run().catch(console.dir); */

// Include route files
/* const usersRoute = require('./routes/api/usersRoute');
const foodRoute = require('./routes/api/foodRoute');

// Use routes
app.use('/users', usersRoute);
app.use('/meals', foodRoute); */