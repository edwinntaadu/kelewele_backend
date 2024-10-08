// fileName : server.js 
// Example using the http module
const express = require('express');
const app = express();
const router = express.Router();

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

const url = //"mongodb://localhost:27017"; 
mongoose.connect(url, { useNewUrlParser: true });
const con = mongoose.connection;


app.use(express.json());

try {
    con.on('open', () => {
        console.log('Connected to the database');
    })
} catch (error) {
    console.log("Error: " + error);
}

// Include route files
const usersRoute = require('./routes/api/usersRoute');
const foodRoute = require('./routes/api/foodRoute');

// Use routes
app.use('/users', usersRoute);
app.use('/meals', foodRoute);