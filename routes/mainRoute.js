const express = require("express");
const res = require("express/lib/response");
const templateController = require("../controllers/templateController");
const templateModel = require("../models/templateModel");
const router = express.Router();
const certificate = require('../controllers/certificateController')
const certificateDataController = require('../controllers/certificateDataController')



router.post('/createCertificateTemplate', templateController.imageUpload.single('image'), createCertificateTemplate) // Add Ceretificate Template
router.post('/addCertificateData', addCertificateData)
router.post('/generateCertificate', certificateDataController.certificateDataUpload.single('csv'), generateCertificate)
router.post('/getTemplate', getTemplateList)

async function createCertificateTemplate(req, res, next) {
	if(req.file){
		// Checks if design is duplicate
		if( await templateModel.findOne({"name": req.body.name}) ){
			console.log("true")
			res.status(400).json({
				status: "failure",
				message: "Design with same name already exists!!",
			})

		} else {
		// Saving Design in Database
			const template = new templateModel({
				"name": req.body.name,
				"path": req.file.path,
				"filename": req.file.filename,
				"size": req.file.size
			})
			await template.save()

			res.status(200).json({
				status: "success",
				message: "Certificate Design created successfully!!",
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

async function getTemplateList(req, res, next){
	const templateList = await templateModel.distinct("name")
	res.status(200).send(templateList);
}

async function addCertificateData(req, res, next){
	templateController.addCertificateData(req.body)
		.then((data) => { res.send(data) })
}

async function generateCertificate(req, res, next) {
	if(req.file){
		certificate.generateCertificate({
			"dataFile": req.file.path, 
			"templateName": req.body.templateName
		}, res)
	}
}

module.exports = router;