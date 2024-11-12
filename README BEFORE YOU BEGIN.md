# PhotoShare briefing

We will be developing PhotoShare, an instagram clone! We will be putting what you have learnt to the test in this project.

### Reminders
1. Before beginning, run the command `npm install`. This will ensure that your project is setup and ready for you to code!
2. Run the `node ./index.js` command to start your server and begin coding!
3. Start in the `index.js` file (found at [/index.js](/index.js) )
4. Find the instructions in the comments. (i.e. `// ? Stage 1: Stage 1.1: Use registerRouter here for the /register path`)
    - Instructions that have `?` in them are instructions
    - Instructions that have `*` in them are notes/hints
    - Note: If you modify any file that ends with the `.js` file extension, you have to restart your server.
5. Only modify files that found in the table below:

### Permitted Files

| Filename                                                                  | Found In              | Purpose                                                                |
|-------------------------------------------------------------------------- | --------------------- | ---------------------------------------------------------------------- |
| [index.js](./index.js)                                                     | /                     | This file is the main server file.                                     |
|                                                                           |                       |                                                                        |
| [register.js](./routes/register.js)                                        | /routes               | This is the router file that contains the routes for the register page |
| [register.ejs](./views/register.ejs)                                       | /views                | This is the ejs file that contains the code for the register page      |
|                                                                           |                       |                                                                        |
| [login.js](./routes/login.js)                                              | /routes               | This is the router file that contains the routes for the login page    |
| [login.ejs](./views/login.ejs)                                             | /views                | This is the ejs file that contains the code for the login page         |
|                                                                           |                       |                                                                        |
| [logout.js](./routes/register.js)                                          | /routes               | This is the router file that contains the routes for the logging out   |
| [logout.ejs](./views/logout.ejs)                                           | /views                | This is the ejs file that contains the code for the logging out        |
|                                                                           |                       |                                                                        |
| [upload.js](./routes/upload.js)                                            | /routes               | This is the router file that contains the routes for the upload page   |
| [upload.ejs](./views/upload.ejs)                                           | /views                | This is the ejs file that contains the code for the upload page        |
|                                                                           |                       |                                                                        |
| [post.js](./routes/post.js)                                                | /routes               | This is the router file that contains the routes for the post page     |
| [post.ejs](./views/post.ejs)                                               | /views                | This is the ejs file that contains the code for the post page          |
|                                                                           |                       |                                                                        |
| [profile.js](./routes/profile.js)                                          | /routes               | This is the router file that contains the routes for the profiles page |
| [profile.ejs](./views/profile.ejs)                                         | /views                | This is the ejs file that contains the code for the profiles page      |
|                                                                           |                       |                                                                        |
| [feed.js](./routes/feed.js)                                                | /routes               | This is the router file that contains the routes for the feed page     |
| [feed.ejs](./views/feed.ejs)                                               | /views                | This is the ejs file that contains the code for the feed page          |
|                                                                           |                       |                                                                        |

### Database Files

#### Modify these files carefully

| Filename                                                                  | Found In              | Purpose                                                                |
|-------------------------------------------------------------------------- | --------------------- | ---------------------------------------------------------------------- |
| [users.json](./lib/data/users.json)                                        | /lib/data/            | This file contains user records that are created upon registration     |
| [posts.json](./lib/data/posts.json)                                        | /lib/data/            | This file contains post records that are created upon image uploads    |
| [comments.json](./lib/data/comments.json)                                  | /lib/data/            | This file contains comment records that are created upon commenting on an image |
|                                                                           |                       |                                                                        |


### Instructions
The project has been broken down into 7 stages. The instructions contains the stage numbers.

You are highly encouraged to start at stage 1 and complete all of its steps first before
moving onto to the next stage.

Here is quick overview of each stage:
- Stage 1:
    - Create the register page
    - Manage the inputs from the registration form
    - Create a new record for the new user
    - [`index.js`](./index.js): Step 1
    - [`register.ejs`](./views/register.ejs): Steps 2 - 3
    - [`register.js`](./routes/register.js): Steps 4 - 8

- Stage 2:
    - Create the login page
    - Manage the inputs from the login form
    - Check the database to check if the records match
    - Create the forget-password page
    - Manage the inputs from the forget-password form
    - [`index.js`](./index.js) Step 1
    - [`login.ejs`](./views/login.ejs): Steps 2 - 4
    - [`login.js`](./routes/login.js): Steps 5 - 6
    - [`forget.ejs`](./views/forget.ejs): Steps 7 - 8

- Stage 3:
    - Create the user session
    - Ensure that all non-authenticated access is routed to the login page
    - [`index.js`](./index.js) Step 1
    - [`login.js`](./routes/login.js): Step 2

- Stage 4:
    - Create the upload page
    - Manage the inputs from the uploads form
    - Create database record for new posts
    - Create the post page (ensure the image can load)
    - [`index.js`](./index.js) Step 1
    - [`upload.ejs`](./views/upload.ejs): Step 2
    - [`upload.js`](./routes/upload.js): Step 3
    - [`post.js`](./routes/post.js): Step 4 - 5

- Stage 5: 
    - Create the profile page
    - Create the edit-profile page
    - Update database with any profile edits
    - Show posted pictures on profile page
    - [`index.js`](./index.js) Step 1
    - [`profile.ejs`](./views/profile.ejs): Step 2 - 4
    - [`profile.js`](./routes/profile.js): Step 5 - 7; Step 9 - 10
    - [`profile-edit.ejs`](./views/profile-edit.ejs): Step 8

- Stage 6:
    - Creating a comments form on the post page
    - Create database record for new comments
    - Retrieve comments from database
    - Deleting the post
    - Remove database record for deleted post
    - [`post.js`](./routes/post.js): Step 1 - 9

- Stage 7:
    - Creating the wall of pictures
    - [`index.js`](./index.js) Step 1
    - [`feed.js`](./routes/feed.js): Step 2 - 4
