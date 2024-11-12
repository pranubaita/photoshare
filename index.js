require("dotenv").config();

const createError = require("http-errors");
const express = require("express");
const path = require("path");
const logger = require("morgan");
const session = require("express-session");
const { isAuthenticated, isNotAuthenticated } = require("./middleware/authentication");

const expressLayouts = require("express-ejs-layouts");
const feedRouter = require("./routes/feed");
const registerRouter = require("./routes/register");
const loginRouter = require("./routes/login");
const logoutRouter = require("./routes/logout");
const forgetRouter = require("./routes/forget");
const uploadRouter = require("./routes/upload");
const postRouter = require("./routes/post");
const profileRouter = require("./routes/profile");

const app = express();

// Set session secret from environment
process.env.SESSION_SECRET = "123";

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(express.static(path.join(__dirname, "public")));
app.use(expressLayouts);
app.use("/*", (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session?.user);
  res.locals.username = req.session?.user;
  return next();
});
app.set("layout", "./layouts/main");
app.set("layout extractScripts", true);
app.set("layout extractStyles", true);

// Route setup
app.use("/register", registerRouter);
app.use("/login", loginRouter);
app.use("/forget", forgetRouter);
app.use("/logout", logoutRouter);
app.use("/upload", uploadRouter);
app.use("/post", postRouter);
app.use("/profile", profileRouter);

// Authentication middleware for root path
app.get("/", (req, res, next) => {
  if (req.session.user) {
    return feedRouter(req, res, next); // Proceed to feedRouter if authenticated
  }
  res.redirect("/login"); // Redirect to loginRouter if not authenticated
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

// Server setup
const debug = require("debug")("photoshare:server");
const http = require("http");

const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

const server = http.createServer(app);

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

function normalizePort(val) {
  const port = parseInt(val, 10);
  if (isNaN(port)) return val;
  if (port >= 0) return port;
  return false;
}

function onError(error) {
  if (error.syscall !== "listen") throw error;
  const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debug("Listening on " + bind);
}
