const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");

const usersFilePath = path.join(__dirname, "../lib/data/users.json");

router.get("/", (req, res) => {
    res.render("login", { error: "" });
});

router.post("/", async (req, res) => {
    const { username, password } = req.body;

    // Read users data
    const usersData = JSON.parse(fs.readFileSync(usersFilePath, "utf8"));

    // Check if user exists using the object key
    const user = usersData[username];

    // Check if user exists and password matches
    if (user && await bcrypt.compare(password, user.password_hash)) {
      console.log("User authenticated successfully")
        req.session.user = user.username; // Store user session 
        req.session.username = user.username;
        res.redirect("/"); // Redirect to home page or feed
    } else {
        res.render("login", { error: "Invalid username or password." });
    }
});

module.exports = router;
