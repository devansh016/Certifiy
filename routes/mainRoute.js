const e = require("express");
const express = require("express");
const res = require("express/lib/response");
const templateController = require("../controllers/templateController");
const templateModel = require("../models/templateModel");
const router = express.Router();

router.post('/uploadTemplate', templateController.imageUpload.single('image'), uploadfile)
router.post('/getTemplate', getTemplateList)

async function uploadfile(req, res, next) {
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

module.exports = router;