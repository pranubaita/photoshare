const express = require("express");
const { isAuthenticated } = require("../middleware/authentication");
const { db, USERS, POSTS } = require("../lib/data");

const router = express.Router();

/**
 * Fetches all the profile data for a given username
 *
 * @param {string} username
 * @returns map containing the user's username, bio, firstName, lastName and posts (url and caption)
 */
function fetchProfileData(username) {
    // Query the user's details from the USERS collection
    const user = db.fetchOne(USERS, username);
    if (!user) {
        return null; // If the user does not exist, return null
    }

    // Get all posts by the user from the POSTS collection
    const posts = db.fetchAll(POSTS).filter(post => post.user === username);

    // Construct a JSON containing the user's data
    const profileData = {
        username: user.username,                     // The username of the user
        first_name: user.first_name,                 // The user's first name
        last_name: user.last_name,                   // The user's last name
        bio: user.bio || "",                         // The user's bio
        posts: posts.map(post => ({
            url: post.url,                           // The URL of the post
            caption: post.caption                     // The caption of the post
        }))    
        // Mapping over posts to extract relevant data
    };
    console.log(profileData)
    return profileData;
}

/**
 * Handles the profile page for a user
 */

router.get("/:username", isAuthenticated, (req, res, next) => {
    const profileData = fetchProfileData(req.params.username);
    if (!profileData) {
        return next("route"); // If user does not exist, proceed to the next route (error handling)
    }

    res.render("profile", {
        profileData,
        isCurrentUser: req.session.user === req.params.username, // Check if viewing own profile
    });
});

// User profile editing page
router.get("/:username/edit", isAuthenticated, (req, res, next) => {
    // Verify the current user
    if (req.params.username !== req.session.user) {
        return next("route"); // If not the user, go to error handling
    }

    res.render("profile-edit", {
        profileData: fetchProfileData(req.params.username),
        error: "",
    });
});

// Handle user profile editing
router.post("/:username/edit", isAuthenticated, (req, res, next) => {
    const username = req.params.username;

    // Validate submitted information
    const { first_name, last_name, bio } = req.body; // Assuming these fields are in the request body
    if (!first_name || !last_name) {
        return res.render("profile-edit", {
            profileData: fetchProfileData(username),
            error: "First name and last name are required.",
        });
    }

    // Update the new information in the database
    const updatedProfile =  {
        first_name,
        last_name,
        bio: bio || "", // Bio can be empty
    };

    db.update(USERS, username, updatedProfile);

    // Redirect the user back to the profile page
    return res.redirect(`/profile/${req.params.username}`);
});

/**
 * This route is for writing the private photos feature
 * in "B - Top Secret Photo"
 *
 * For this route, do the same thing as the wall feed,
 * except your code should only get photos that are
 * marked private
 */
router.get("/:username/private", isAuthenticated, (req, res, next) => {
    // Check current user
    if (req.params.username !== req.session.user) {
        return next("route"); // If the user is not authorized, proceed to error handling
    }

    // Query all photo data (for private photos)
    const privatePosts = db.fetchAll(POSTS).filter(post => post.user === req.params.username && post.isPrivate);

    // Prepare the data to send to the view (you can adjust as needed)
    console.log(POSTS.url)
    const photoData = privatePosts.map(post => ({
        url: post.url,
        caption: post.caption,
        likes: post.likes.length, // Assuming likes is an array
    }));

    res.render("private-photos", { photos: photoData });
});

module.exports = router;
