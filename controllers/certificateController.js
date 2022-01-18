const { jsPDF } = require("jspdf")
const imageToBase64 = require('image-to-base64')
const templateModel = require("../models/templateModel");
const certificateModel = require("../models/certificateModel");
const fs = require('fs')
const csv = require('csv-parser')
const path = require('path')
var archiver = require('archiver');
require('../data/fonts/ArchivoBlack-normal')

async function generateCertificate({dataFile, templateName}, res){
	var template = await templateModel.findOne({"name": templateName})
	if(!template.readyToUse){
		res.send({
			"status": "Failure",
			"message": "Setting not saved."
		})
		return
	}
	folderName = path.join(__dirname, "../data/certificate-generated/", template.name)
	// Create Directory for certificates
	if (!fs.existsSync(folderName)) {
		fs.mkdirSync(folderName)
	  }
	fs.createReadStream(dataFile)
	.pipe(csv())
	.on('data', (row) => {
		createCertificate({
			"name": row.name, 
			"email": row.email, 
			template })
	})
	.on('end', () => {
		 zipFiles({ 
			source_file: path.join(__dirname, "../data/certificate-generated/", template.name),
			output_file: path.join(__dirname, "../public/download/", template.name + ".zip")
		 })
		console.log("All Certificates Generated.")
		res.send({
			"status": "Success",
			"message": "Certificate Created.",
			"link": "download/" + template.name + ".zip"
		})
	});
	
}

async function createCertificate({name, email, template}){
	// Creating a blank pdf
	var doc = new jsPDF({
		orientation: 'landscape'
	})
	
	// Finding file type of the certificate design template
	var filetype = template.name.split(".")[1];

	// Adding certificate image
	var imgData = 'data:image/' + filetype+ ';base64,'+ await imageToBase64(template.path);
	doc.addImage(imgData, filetype, 0, 0, 297, 210); 

	// Adding Text and Saving
	doc.setFontSize(template.settings.fontSize);
	doc.setTextColor(template.settings.fontColor[0], template.settings.fontColor[1], template.settings.fontColor[2]);
	doc.setFont(template.settings.font, 'normal'); 
	// Adding Name on certificate
	doc.text(name, template.settings.positionX , template.settings.positionX, null, null, 'center');
	var currDate = Date.now()
	var certiPath = path.join(__dirname, "../data/certificate-generated/", template.name,"/") + template.name + "_" + currDate + ".pdf"
	doc.save(certiPath);

	// Register Certificate in DB
	var certificate = new certificateModel({
		name, 
		email,
		"template": template.name,
		"path":  path.join("data/certificate-generated/", template.name,"/") + template.name + "_" + currDate + ".pdf",
		"uniqueID": template.name + "_" + currDate
	})
	await certificate.save()
}

function zipFiles({ output_file, source_file }){
	var output = fs.createWriteStream( output_file );
	var archive = archiver('zip');
	output.on('close', function () {
    	console.log('Zip file Created at  ' + output_file);
	});
	archive.on('error', function(err){
    	throw err;
	});
	archive.pipe(output);
	archive.directory(source_file, false);
	archive.finalize();
}

module.exports = {
	zipFiles,
	createCertificate,
	generateCertificate
}