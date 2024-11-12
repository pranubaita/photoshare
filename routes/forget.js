const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");

const usersFilePath = path.join(__dirname, "../lib/data/users.json");

router.get("/", (req, res) => {
    res.render("forget", { error: "", success: "" });
});

router.post("/", (req, res) => {
    const { email, newPassword } = req.body;

    // Read users data
    const usersData = JSON.parse(fs.readFileSync(usersFilePath, "utf8"));

    // Find user by email
    const user = Object.values(usersData).find(user => user.email === email);

    if (user) {
        // Hash the new password before saving
        const saltRounds = 10;
        bcrypt.hash(newPassword, saltRounds, (err, hash) => {
            if (err) {
                return res.render("forget", { error: "Error hashing password.", success: "" });
            }

            // Update the user's password
            user.password_hash = hash; // Save the hashed password

            // Save updated user data back to the JSON file
            fs.writeFileSync(usersFilePath, JSON.stringify(usersData, null, 2));

            res.render("forget", { error: "", success: "Password has been reset successfully." });
        });
    } else {
        res.render("forget", { error: "Email not found.", success: "" });
    }
});

module.exports = router;
