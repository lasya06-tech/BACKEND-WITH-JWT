day-0 (13-01-2026) notes.

//Script	Command	Use
//start	node server	Run the app normally (for production)
//server	nodemon server	Run the app in dev mode, auto-restarts on code changes
//💡 Tip:
//During development → use: npm run server
//When deploying → use: npm start

day1(14-01-2026)
//init middlewear
app.use(express.json({extended:false}));

Without express.json()

req.body = undefined


With express.json()

req.body = { name: "Jamie", email: "jamie@example.com" }
false → simpler parsing(basicobjects)


In password hashing:
A salt is a random string added to a password before hashing.
It ensures that even if two users have the same password, their hashes will be different.

Because after users register, we usually want them to be considered logged in immediately.

So instead of making them register ➜ then login ➜ then get token…

We give the token during registration itself, so the frontend (React, mobile, etc.) can:

✔ store it
✔ authenticate future requests
✔ avoid asking user for login again


**************
JWT token internally has: header.payload.signature
The signature is created like this: signature = hash(header + payload + jwtSecret)
Meaning: token depends on your secret without secret → nobody can modify payload and still make it valid 
secret acts like a lock key


************(about auth.js middlewear)
Client must send token in header:
x-auth-token: <jwt>

************
Verify token
const decoded=jwt.verify(token,config.get('jwtSecret'));
Checks if token is signed with correct secret key.
If valid → decoded contains user data like:
{ "user": { "id": "123..." } }

router.get('/me', auth, (req, res) => {
    console.log(req.user.id); // here user id is available
});
So auth middleware sets req.user, then route can use it.


SIMPLE
oken lets the user stay logged in without asking email+password again.
➡️ Other pages can use the token to check “is user already logged in?” and show data.
we use User.findById(req.user.id) to get user details


***********
How do you apply middleware to specific routes in an Express app?
Add it as a second argument to the route function---->router.get'/',auth,async(req,res)=>
Correct! Adding middleware as a second argument ensures it processes requests before reaching the route handler.

**********
findOne → gets the profile (with user ID only)

.populate() → “fills in” the referenced user details, so you can print more than just ID
(in profile.js see)

******
const 
    company,
    website,
    location,
 = req.body;
 This is destructuring — it extracts fields out of req.body so you don't have to write:

req.body.company
req.body.website
req.body.bio

*************
✔️ In Node/Express + Mongoose
We usually skip DTOs and directly return the Document returned by Mongoose.

But we use populate() to join data instead of DTO mapping.
