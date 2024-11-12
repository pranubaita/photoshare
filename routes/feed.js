const express = require("express");
const { db, POSTS, COMMENTS } = require("../lib/data");
const { isAuthenticated } = require("../middleware/authentication");

const router = express.Router();

// Route to render the feed
router.get("/", isAuthenticated, (req, res, next) => {
  // Fetch all posts data
  const posts = db.fetchAll(POSTS);

  // Fetch all comments data
  const comments = db.fetchAll(COMMENTS);

  // Initialize an empty array for image data
  const imageData = [];

  // Loop through posts to group comments with their respective posts
  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    const postComments = [];

    // Loop through comments to find those that belong to the current post
    for (let j = 0; j < comments.length; j++) {
      const comment = comments[j];
      if (comment.post === post.id) {
        postComments.push({
          body: comment.body,
          commenter: comment.commenter,
          timestamp: comment.time_stamp,
        });
      }
    }

    // Create an object for the current post with its comments
    imageData.push({
      url: post.url, // Assuming `post.url` is the unique URL identifier
      caption: post.caption,
      postedBy: post.user,
      comments: postComments,
    });
  }

  console.log(imageData); // Optional: log imageData to verify structure

  // Render the feed view with image data and the current username
  return res.render("feed", { imageData: imageData, username: req.session.user });
});

// Route to handle posting a new comment
router.post("/post/:url", isAuthenticated, (req, res, next) => {
  const postUrl = req.params.url;
  const { comment } = req.body;

  // Find the post by URL (assuming the URL is unique for each post)
  const post = db.fetch(POSTS, { url: postUrl });
  if (!post) {
    return res.status(404).send("Post not found");
  }

  // Insert the new comment into the COMMENTS database
  db.insert(COMMENTS, {
    post: post.id,
    body: comment,
    commenter: req.session.user, // Use session data to get the username
    time_stamp: new Date().toISOString(),
  });

  // Redirect back to the feed
  res.redirect("/feed");
});

module.exports = router;
