const dotenv = require('dotenv')
dotenv.config();


const express = require("express")

const app = express();

const cookieParser = require("cookie-parser");

const cors = require("cors");

const corsOptions = {
    origin: "*",
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}
// app.use(bodyParser.json());

app.use(cors(corsOptions));

const db = require("./db");

//cookie parser 
app.use(cookieParser());

// Middleware to parse JSON body
app.use(express.json());

//passport api 

const passport = require('passport')
const session = require('express-session')

const LocalStrategy = require('passport-local').Strategy

app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,

}))

app.use(passport.initialize());

app.use(passport.session());


app.use(express.urlencoded({ extended: true }));


const regsiterRoutes = require("./routes/register");
const userpostroutes = require("./routes/userpost");

app.use("/register", regsiterRoutes);
app.use("/userpost", userpostroutes);

// check route
app.get('/get-check', (req, res) => {
    res.send("hello this get check route ")

})

app.post('/post-check', (req, res) => {

    res.json({
        message: 'Data recevied successfully',
        data: req.body
    })
})


db.sync({ force: false })
    .then(() => {
        app.listen(process.env.PORT, console.log('Server is running on port: ' + process.env.PORT));
    });
