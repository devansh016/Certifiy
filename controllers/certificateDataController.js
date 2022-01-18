const multer = require("multer")
const path = require('path')

const certificateDataStorage = multer.diskStorage({
    // Destination to store image     
    destination: 'data/certificate-data', 
      filename: (req, file, cb) => {
          cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname))
            // file.fieldname is name of the field (image)
            // path.extname get the uploaded file extension
    }
});

const certificateDataUpload = multer({
	storage: certificateDataStorage,
	limits: {
	  fileSize: 1000000 // 1000000 Bytes = 1 MB
	},
	fileFilter(req, file, cb) {
	  if (!file.originalname.match(/\.(csv)$/)) { 
		 // upload only csv format
		 return cb(new Error('Please upload a csv file.'))
	   }
	 cb(undefined, true)
  }
})

module.exports = {
	certificateDataUpload
}