

const express = require('express');
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require('mongodb');


// fileName : server.js 
// Example using the http module
const app = express();
const router = express.Router();
app.use(cors());
app.use(express.json());



// Making Routes
app.get('/', (req, res) => {
    res.send('<h1>Hello, Express.js Server!</h1>');
});

// Specify the port to listen on
const port = process.env.PORT || 3000; 

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

const uri = "mongodb+srv://yaokuz:euYrCqua7mQtA0kH@clusterclientbuyer.uyo2s.mongodb.net/?retryWrites=true&w=majority&appName=ClusterClientBuyer";
const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });



  async function run() {
    try {
      // Connect the client to the server	(optional starting in v4.7)
      await client.connect();
      // Send a ping to confirm a successful connection
      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }
  }
  run().catch(console.dir);

// Include route files
const usersRoute = require('./routes/api/usersRoute');
const foodRoute = require('./routes/api/foodRoute');

// Use routes
app.use('/users', usersRoute);
app.use('/meals', foodRoute);