const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
    if (req.session.user) {
        // Set the user and userId in req.session to null
        req.session.user = null
        req.session.userId = null
        
        // Use req.session.save to ensure the session data is saved
        req.session.save(function (err) {
            if (err) next(err);

            // Use req.session.regenerate to ensure the session key
            // is regenerated
            req.session.regenerate(function (err) {
                if (err) next(err);
                res.redirect("/");
            });
        });
    } else {
        res.redirect("/");
    }
});

module.exports = router;
