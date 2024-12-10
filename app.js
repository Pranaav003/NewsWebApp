// app.js
const express = require('express'),
    expressLayouts = require('express-ejs-layouts'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    cookieParser = require('cookie-parser'),
    flash = require('connect-flash')  

const { checkLogin } = require('./app/middleware')
require('dotenv').config()
const path = require('path')
const cors = require('cors')
const app = express()

const port = process.env.PORT || 80;

//set sessions and cookie parser
app.use(cookieParser())
app.use(session({
  secret: process.env.SECRET,
  cookie: {maxAge: 3600000}, //1 hour session expiration
  resave: false, // forces the session to be saved back to the store
  saveUninitialized: false // dont save unmodified
}))
app.use(flash())

// connect to our database
mongoose.connect(process.env.DB_URI)
    .then(() => console.log('DB connected!'))
    .catch(() => {
        console.log('Cannot connect to MongoDB!')
        process.exit(1)
    })

// Middleware
app.use(express.json());
app.use(cors());

// use body parser to grab info from a form
app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs')
app.use(expressLayouts)

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

//Made with AI generative assistance
//Disables pages from being accessed without user login
app.use((req, res, next) => {
    const excludedRoutes = ['/showLogin', '/showSignUp', '/login', '/signUp', '/logOut'];
    if (excludedRoutes.includes(req.path)) {
        return next() // Skip the middleware for these routes
    }
    checkLogin(req, res, next) // Apply login middleware
})

// Import and use routes
app.use(require('./app/routes'))

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})

module.exports = app