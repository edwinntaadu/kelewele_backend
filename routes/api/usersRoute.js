// routes/users.js
const express = require('express');
const router = express.Router();

// My route definitions
router.get('/', (req, res) => {
    res.send('default user route');
});

router.get('/signup', (req, res) => {
    res.send('working signup route');
});

router.get('/signin', (req, res) => {
    res.send('working signin route');
});

router.get('/signup_auth', (req, res) => {
    res.send('working signin route');
});

router.get('/signup_auth', (req, res) => {
    res.send('working signin route');
});

// export the router module so that server.js file can use it
module.exports = router;