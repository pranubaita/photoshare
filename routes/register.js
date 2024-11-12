const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { db, USERS } = require("../lib/data");
const { emailIsValid, usernameIsValid } = require("../lib/validation");

router.get("/", (req, res, next) => {
    if (req.session.user) {
        // Redirect user if already logged in
        return res.redirect("/");
    }
    res.render("register", { userData: {}, error: "" });
});

router.post("/", async (req, res, next) => {
    // Ensure all fields exist with default empty strings
    const userData = {
        username: req.body.username || "",
        email: req.body.email || "",
        password: req.body.password || "",
        first_name: req.body.first_name || "",
        last_name: req.body.last_name || "",
    };

    // ? Stage 1.4: Trim all fields and set email and username to lowercase
    userData.username = userData.username.trim().toLowerCase();
    userData.email = userData.email.trim().toLowerCase();
    userData.first_name = userData.first_name.trim();
    userData.last_name = userData.last_name.trim();

    // ? Stage 1.5: Check if the submitted information is valid
    if (!emailIsValid(userData.email) || !usernameIsValid(userData.username)) {
        return res.render("register", {
            error: "Invalid email or username format.",
            userData,
        });
    }

    // ? Stage 1.6: Check that first and last name are not empty, and password meets minimum length
    if (userData.password.length < 8) {
        return res.render("register", {
            error: "First name, last name cannot be empty, and password must be at least 8 characters long.",
            userData,
        });
    }

    // ? Stage 1.7: Hash password using a salt
    try {
        userData.password_hash = await bcrypt.hash(userData.password, 10);
    } catch (error) {
        console.error("Error hashing password:", error);
        return res.render("register", {
            error: "Error processing your registration. Please try again.",
            userData,
        });
    }

    // ? Stage 1.8: Complete the following dictionary
    const newUserRecord = {
        username: userData.username,
        email: userData.email,
        password_hash: userData.password_hash,
        first_name: userData.first_name,
        last_name: userData.last_name,
        bio: "",
    };

    try {
        db.create(USERS, newUserRecord);
    } catch (e) {
        console.error(e);
        return res.render("register", {
            error: "Error: " + e.message,
            userData,
        });
    }
    console.log("test " + newUserRecord)
    res.redirect("/");
});

module.exports = router;
