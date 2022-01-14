const { jsPDF } = require("jspdf")
const imageToBase64 = require('image-to-base64')
const fs = require('fs')
const csv = require('csv-parser')
const path = require('path')
require('../data/fonts/ArchivoBlack-normal')

async function generateCertificate({dataFile, template, fontSize, fontColor}){
	fs.createReadStream(dataFile)
	.pipe(csv())
	.on('data', (row) => {
		createCertificate({
			"name": row.name, 
			"email": row.email, 
			template, fontSize, fontColor})
	})
	.on('end', () => {
		console.log('Certificates Created.');
	});
}

async function createCertificate({name, email, template, fontSize, fontColor}){

	// Creating a blank pdf
	var doc = new jsPDF({
		orientation: 'landscape'
	})
	
	// Finding file type of the certificate design template
	var filetype = template.split(".")[1];

	// Adding certificate image
	var imgData = 'data:image/' + filetype+ ';base64,'+ await imageToBase64(template);
	doc.addImage(imgData, filetype, 0, 0, 297, 210); 

	// Adding Text and Saving
	doc.setFontSize(fontSize);
	doc.setTextColor(fontColor[0], fontColor[1], fontColor[2]);
	doc.setFont('ArchivoBlack', 'normal'); 
	doc.text(name, (doc.internal.pageSize.width / 2), 110, null, null, 'center');
	doc.save(path.join(__dirname, "../data/certificate-generated/") + email + ".pdf");
}

module.exports = {
	createCertificate,
	generateCertificate
}