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

// const certificate = require('./controllers/certificateController')
// certificate.createCertificate({
// 	name: "Devansh Chaudhary",
// 	email: "Dev@gmail.com",
// 	template: {
// 		name:"JYC",
// 		path:"data\\certificate-template\\image_1642505247588.png",
// 		filename:"image_1642505247588.png",
// 		settings: {
// 			fontColor:[114,116,164],
// 			font: "ArchivoBlack",
// 			fontSize: "46.7",
// 			positionX: 148.5,
// 			positionY: 110
// 		},
// 		totalCertificates: 0,
// 		readyToUse: true
// 	}
// });

const mainRoute = require("./routes/mainRoute");
app.use(mainRoute);

app.listen(port)
console.log("App is running at port " + port)