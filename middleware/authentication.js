function isAuthenticated(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    next("route");
  }
}

function isNotAuthenticated(req, res, next) {
  if (req.session.user) {
    next("route");
  } else {
    next();
  }
}

module.exports = { isAuthenticated, isNotAuthenticated };
