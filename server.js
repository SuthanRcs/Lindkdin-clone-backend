const dotenv = require('dotenv')
dotenv.config()


const express = require("express")

const app = express();

const cookieParser = require("cookie-parser")

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

const regsiterRoutes = require("./routes/regsiter")

app.use("/resgiter", regsiterRoutes)

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
