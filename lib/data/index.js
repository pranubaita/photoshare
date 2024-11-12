const path = require("path");

const { initialize } = require("./database");
const { Collection, Property } = require("./collection");

/**
 * This is convenient JSON-based data storage framework you can use to simplify your work.
 * As the data you want to save becomes more and more complex, this code will take care
 * of managing it for you, so you can focus on the server-logic and avoid headaches :)
 * 
 * Here's what you need to know to use this:
 * - The objects you store are categorized into "collections" (users, posts, comments, etc.)
 * - Each collection is an array of objects stored in a JSON file
 * - For every collection, a separate JSON file will be created in this directory (users.json, posts.json, ...)
 * - Each object is stored in the file of the appropriate collection
 * - Each collection declares a specification of properties each object in the collection must have
 * - That way, all objects in a given collection are uniform
 * - The specified properties for each collection also define additional constraints
 * - These constraints make sure stored properties have correct types, non-empty values, unique values, etc.
 * - You can read more about these constraints in /lib/data/collection.js
 * - We will automatically enforce these constraints on the objects you try to save
 * - This will prevent a lot of annoying bugs from happening. You can thank us later :)
 * - You can see the collections we have defined for you below
 * 
 * To actually put stuff in the storage:
 * ```
 * const { db, USERS, POSTS, COMMENTS } = require("../lib/data");
 * 
 * db.create(USERS, { username: "h4rryp0tt3r", email: "magic@hogwarts.org", first_name: "Harry", ... });
 * db.create(POSTS, { url: "2c523f4c151be1520d8c641e4ec8d9d8", caption: "", time_stamp: Date.now(), user: "h4rryp0tt3r", ... });
 * 
 * const user = db.fetchOne(USERS, "h4rryp0tt3r");
 * const posts = db.fetchAll(POSTS);
 * 
 * db.update(USERS, "h4rryp0tt3r", { first_name: "Lord", last_name: "Voldemort", ... });
 * 
 * db.delete(POSTS, "2c523f4c151be1520d8c641e4ec8d9d8")
 * ```
 * 
 * As you can see above, there are 5 methods you can use to fetch, create, update or delete objects.
 * Each method accepts the relevant collection, and maybe additional parameters, like a new object to store,
 * or the ID of an object to fetch, update, delete.
 * You can read more about these methods in /lib/data/database.js.
 * 
 * The ID with which you reference an object in a collection depends on the collection.
 * Users are identified by their username, posts by their URLs, comments by their numerical IDs, etc.
 * See the collection definitions below to find out more.
 */

// Users collection
const USERS = new Collection("users", [
    new Property("username", String, { primary: true }),    // username is the ID with which you fetch/update/delete (the primary property)
    new Property("email", String, { unique: true }),        // user email. must be unique
    new Property("password_hash", String),                  // bcrypt hash of the user's password
    new Property("first_name", String),                     // first name
    new Property("last_name", String),                      // last name
    new Property("bio", String, { optional: true }),        // user bio. can be empty
]);

// Posts (uploaded photos) collection
const POSTS = new Collection("posts", [
    new Property("url", String, { primary: true }),         // url is the name of the uploaded photo file in the /uploads folder. this is the ID of posts
    new Property("caption", String, { optional: true }),    // photo caption. can be empty
    new Property("time_stamp", Number),                     // upload timestamp. see `Date.now`
    new Property("user", String),                           // username of user who uploaded the photo
    new Property("likes", String, { multiple: true }),      // array of usernames of users who liked the photo
]);

// Comments collection
const COMMENTS = new Collection("comments", [
    new Property("id", Number, { primary: true, autoincrement: true }), // numerical ID which is automatically set by the DB. no need to set it manually
    new Property("body", String),                                       // comment body. cannot be empty
    new Property("time_stamp", Number),                                 // comment timestamp. see `Date.now`
    new Property("commenter", String),                                  // username of user who made the comment
    new Property("post", String),                                       // url of post for which this comment was made
]);

// Initialize the JSON files for all the collections
const db = initialize([USERS, POSTS, COMMENTS], __dirname);

module.exports = { db, USERS, POSTS, COMMENTS };
