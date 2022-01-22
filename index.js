const express = require('express')
const app = express()
const path = require("path")
var cors = require('cors')
require("./utils/database")
const port = process.env.PORT || 80;

app.use(cors())
app.use(express.json()); 
app.use(express.urlencoded({ extended: false }))

app.use(express.static(path.join(__dirname, "public")));

const certificate = require('./controllers/certificateController')

const mainRoute = require("./routes/mainRoute");
app.use(mainRoute);

app.listen(port)
console.log("App is running at port " + port)