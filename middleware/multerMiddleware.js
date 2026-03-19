const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: function(req,file, cb){
        cb(null, "uploads/resume");
    },
    filename: function(req,file,cb){
        const uniqueName = Date.now() + path.extname(file.originalname);
        cb(null, uniqueName)
    }
})

const uploadResume = multer({ storage });

module.exports = uploadResume;