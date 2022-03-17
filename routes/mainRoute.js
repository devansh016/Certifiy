const express = require("express");
const uploadController = require("../controllers/uploadController");
const eventController = require("../controllers/eventController");
const eventModel = require("../models/eventModel");
const router = express.Router();
const certificateController = require('../controllers/certificateController');
const certificateModel = require("../models/certificateModel");

// Done
router.post('/createEvent', uploadController.imageUpload.single('image'), createEvent)
router.post('/addEventData', addEventData)
router.post('/generateCertificate', uploadController.csvUpload.single('csv'), generateCertificates)
router.post('/getEvent', getEventList)
router.post('/getCertificateLogs', getCertificateLogs)
router.get('/verifyCertificate', verifyCertificate)

// Step 1: Creating a event in DB
async function createEvent(req, res, next) {
	if(req.file){
		// Checks if event is duplicate
		if( await eventModel.findOne( {"name": req.body.name} ) ){
			res.status(400).json({
				status: "failure",
				message: "Event with same name already exists!",
			})
		} else {
		// Creating a Event in Database
			const event = new eventModel({
				"name": req.body.name,
				"designPath": req.file.path,
				"filename": req.file.filename,
			})
			await event.save()
			res.status(200).json({
				status: "success",
				message: "Event created successfully!",
			})
		}
	} else {
		res.status(400).json({
			status: "failure",
			message: "Upload a File!!",
		})
	}
	res.send()
}

// Step 2: Adding event data in DB
async function addEventData(req, res, next){
	eventController.addEventData(req.body)
		.then((data) => { res.send(data) })
}

// Step 3: Add CSV File and generate certificates 
async function generateCertificates(req, res, next) {
	if(req.file){
		certificateController.generateCertificates({
			"dataFile": req.file.path, 
			"event": req.body.event
		}, res)
	}
}

// Send all events list
async function getEventList(req, res, next){
	res.status(200).send(await eventModel.distinct("name"));
}

async function getCertificateLogs(req, res, next){
	res.status(200).send(await certificateModel.find({"event": req.body.event}, { name: 1, certificateID: 1}))
}
async function verifyCertificate(req, res, next){
	certificateController.verifyCertificate(req.body.certificateID)
		.then(data => {
			res.send(data)
		})
}


module.exports = router;