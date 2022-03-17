const { jsPDF } = require("jspdf")
const imageToBase64 = require('image-to-base64')
const eventModel = require("../models/eventModel");
const certificateModel = require("../models/certificateModel");
const fs = require('fs')
const csv = require('csv-parser')
const path = require('path')
var archiver = require('archiver');
require('../data/fonts/ArchivoBlack-normal');
require('../data/fonts/PinyonScript-normal');
require('../data/fonts/MyriadPro-normal');

async function generateCertificates({dataFile, event}, res){
	
	var eventData = await eventModel.findOne({"name": event })
	var serialNumber = eventData.totalCertificates
	if(!eventData.readyToUse){
		res.send({
			"status": "Failure",
			"message": "Event Data not added yet."
		})
		return
	}
	
	folderName = path.join(__dirname, "../public/certificates/")
	console.log(folderName)
	// res.send(folderName)
	// Create Directory for certificates
	if (!fs.existsSync(folderName)){
		fs.mkdirSync(folderName);
	}
	

	fs.createReadStream(dataFile)
	.pipe(csv())
	.on('data', (row) => {
		serialNumber ++
		createCertificate({
			"name": row.name,
			"certid": row.certid,
			"certificateNumber": serialNumber,
			"event": eventData,
		})
	})
	.on('end', () => {
		// zipFiles({ 
		// 	source_file: path.join(__dirname, "../public/certificates/", eventData.name),
		// 	output_file: path.join(__dirname, "../public/download/", eventData.name + ".zip")
		// })
		eventData.totalCertificates = serialNumber
		eventData.save()
		res.send({
			"status": "Success",
			"message": "Certificates generated for " + eventData.name + " .",
		})
	});
	
}

async function createCertificate({name, event, certificateNumber, certid }){

	// Creating a blank pdf
	var doc = new jsPDF({
		orientation: 'landscape'
	})
	var filetype = event.filename.split(".")[1];
	var imgData = 'data:image/' + filetype+ ';base64,'+ await imageToBase64(event.designPath);
	doc.addImage(imgData, filetype, 0, 0, 297, 210,'','SLOW'); 

	// Adding Text and Saving
	doc.setFontSize(event.settings.fontSize);
	doc.setTextColor(event.settings.fontColor[0], event.settings.fontColor[1], event.settings.fontColor[2]);
	doc.setFont(event.settings.font, 'normal'); 
	doc.text(name, event.settings.positionX , event.settings.positionY, null, null, 'center');

	// Adding certificate ID
	doc.setFontSize(14);
	doc.setTextColor(0,0,0);
	doc.setFont("Courier", 'normal');
	doc.text(certid, 260 , 204, null, null, 'center');

	var certiPath = path.join(__dirname, "../public/certificates/") + event.name + "-"+ certificateNumber  + ".pdf"
	doc.save(certiPath);

	// Register Certificate in DB
	var certificate = new certificateModel({
		"event": event.name,
		"name": name,
		"path":  certiPath,
		"certificateNumber": certificateNumber,
		"certificateID":  certid
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
async function verifyCertificate(certificateID){
	var cert = await certificateModel.findOne({"certificateID": certificateID})
	if(cert){
		return{
			"message": "Certificate Found.",
			"name": cert.name,
			"issuedDate": cert.createdDate,
			"event": cert.event
		}
	} else {
		return {
			"message": "Certificate Not Found."
		}
	}

}
module.exports = {
	zipFiles,
	createCertificate,
	generateCertificates,
	verifyCertificate
}