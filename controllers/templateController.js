const multer = require("multer")
const templateModel = require("../models/templateModel");
const path = require('path')

const imageStorage = multer.diskStorage({
    // Destination to store image     
    destination: 'data/certificate-template', 
      filename: (req, file, cb) => {
          cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname))
            // file.fieldname is name of the field (image)
            // path.extname get the uploaded file extension
    }
});

const imageUpload = multer({
	storage: imageStorage,
	limits: {
	  fileSize: 1000000 // 1000000 Bytes = 1 MB
	},
	fileFilter(req, file, cb) {
	  if (!file.originalname.match(/\.(png|jpg)$/)) { 
		 // upload only png and jpg format
		 return cb(new Error('Please upload a png or jpg file.'))
	   }
	 cb(undefined, true)
  }
})

async function addCertificateData({name, font, fontSize, fontColor, positionX, positionY}){
	var template = await templateModel.findOne({name})
	if(!template){
		return {
			status: "failure",
			message: "No template exists with the following name.",
		}
	}
	template.settings.font = font
	template.settings.fontSize = fontSize
	template.settings.fontColor = fontColor
	template.settings.positionX = positionX
	template.settings.positionY = positionY
	template.readyToUse = true
	await template.save();

	return {
		status: "success",
		message: "Certificate template saved.",
	}
}
module.exports = {
	imageUpload,
	addCertificateData,
}