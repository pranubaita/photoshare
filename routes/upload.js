const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middleware/authentication");
const multer = require("multer");
const { db, POSTS } = require("../lib/data");

const upload = multer({ dest: "uploads/" });

/**
 * Renders the photo-uploading page
 */
router.get("/", isAuthenticated, (req, res, next) => {
    return res.render("upload");
});

// Default route if user is unauthenticated
router.get("/", (req, res, next) => {
    res.redirect("/");
});

/**
 * This route is for handling photo uploading in "Look At My Photo"
 *
 * For this route, you only need to save the image information (the
 * file name, not the entire file), the caption, the poster's username
 * and the time stamp to the database.
 */
router.post("/", isAuthenticated, upload.single("image"), (req, res, next) => {
    if (req.file) {
        try {
            // Create a new photo record
            const newPhotoRecord = {
                url: `${req.file.filename}`,   // Stage 4.4.1: URL to access the uploaded image
                caption: req.body.caption || "",         // Stage 4.4.2: Caption provided by the user
                time_stamp: Date.now(),    // Stage 4.4.3: Current timestamp
                user: req.session.user||"",         // Stage 4.4.4: Username of the authenticated user
                likes: []                                 // Initial likes array
            };

            // Save the new photo record to the database
            db.create(POSTS, newPhotoRecord);

            // Redirect user to the corresponding post page to view the uploaded photo
            res.redirect(`/post/${req.file.filename}`);
        } catch (e) {
            console.error(e);
            // If there's an error, redirect user back to the upload page
            return res.render("upload", { error: "Failed to upload photo. Please try again." });
        }
    } else {
        // If no file is submitted, redirect user back to the upload page
        return res.render("upload", { error: "No file was uploaded. Please select a file." });
    }
});

module.exports = router; // Note the corrected spelling of 'module.exports'
