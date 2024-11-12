const express = require("express");
const { db, POSTS, COMMENTS } = require("../lib/data");
const { isAuthenticated } = require("../middleware/authentication");

const router = express.Router();

/**
 * Fetches all the details for a given post and renders the post page.
 */
router.get("/:id", isAuthenticated, (req, res, next) => {
    const url = req.params.id;
    const post = db.fetchOne(POSTS, url);

    // Check if the post exists
    if (!post) {
        return next("route");
    }

    // Fetch comments associated with the post
    const comments = db.fetchAll(COMMENTS).filter(comment => comment.post === url);

    // Prepare data for rendering
    const photoData = {
        url: `${req.params.id}`,
        loggedIn: true,
        postedBy: post.user,
        caption: post.caption,
        time: post.time_stamp,
        likes: post.likes,
        comments: comments
    };

    // Render the post view with session data
    return res.render("post", { photoData, session: req.session });
});

/**
 * Handles adding a new comment on a post.
 */
router.post("/:id", isAuthenticated, (req, res, next) => {
    const url = req.params.id;
    const commentBody = req.body.comment?.trim();

    // Redirect if the comment is empty
    if (!commentBody) {
        return res.redirect(`/post/${url}`);
    }

    // Verify the post exists
    const post = db.fetchOne(POSTS, url);
    if (!post) {
        return next("route");
    }

    // Create a new comment
    const newCommentData = {
        body: commentBody,
        time_stamp: Date.now(),
        commenter: req.session.user,
        post: url,
    };

    db.create(COMMENTS, newCommentData);
    res.redirect(`/post/${url}`);
});

/**
 * Toggles the like/unlike status for the current user on the post.
 */
router.post("/:id/like", isAuthenticated, (req, res, next) => {
    const url = req.params.id;
    const post = db.fetchOne(POSTS, url);

    if (!post) {
        return next("route");
    }

    const user = req.session.user;
    const userIndex = post.likes.indexOf(user);

    // Add or remove user from likes
    if (userIndex === -1) {
        post.likes.push(user);
    } else {
        post.likes.splice(userIndex, 1);
    }

    db.update(POSTS, url, { likes: post.likes });
    res.redirect(`/post/${url}`);
});

/**
 * Deletes the specified post if the current user is the owner.
 */
router.post("/:id/delete", isAuthenticated, (req, res, next) => {
    const url = req.params.id;
    const post = db.fetchOne(POSTS, url);

    // Check ownership
    if (!post || post.user !== req.session.user) {
        return next("route");
    }

    // Delete the post and associated comments
    db.delete(POSTS, url);
    db.fetchAll(COMMENTS)
      .filter(comment => comment.post === url)
      .forEach(comment => db.delete(COMMENTS, comment.id));

    res.redirect(`/profile/${req.session.user}`);
});

/**
 * Deletes a specific comment if the current user is the commenter.
 */
router.post("/:id/:commentId/delete", isAuthenticated, (req, res, next) => {
    const { id: postId, commentId } = req.params;
    const comment = db.fetchOne(COMMENTS, commentId);

    if (comment && comment.commenter === req.session.user) {
        db.delete(COMMENTS, commentId);
    }

    res.redirect(`/post/${postId}`);
});

// Handle image file requests
router.get("/img/:id", isAuthenticated, (req, res, next) => {
    try {
        res.sendFile(`${req.params.id}`, { root: "uploads" });
    } catch (e) {
        next("route");
    }
});

module.exports = router;
