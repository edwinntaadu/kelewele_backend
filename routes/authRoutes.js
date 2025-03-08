const express = require("express");
const passport = require("passport");
const router = express.Router();

// Route to trigger Google OAuth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Callback route after authentication
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    successRedirect: "http://localhost:5500/home.html",
  })
);

// Facebook OAuth routes
router.get("/facebook", passport.authenticate("facebook", { scope: ["email"] }));

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: "/login",
    successRedirect: "http://localhost:5500/home.html",
  })
);

// Logout route
/*router.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("/");
  });
});*/

module.exports = router;
