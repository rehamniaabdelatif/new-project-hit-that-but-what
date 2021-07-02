const multer = require('multer')
const path = require('path')

// Set Storgage Engine
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function(req, file, cb){
        cb(null, file.filename + '-' + Date.now() + path.extname(file.originalname))
    }
})

// check file type
function checkFileType(file, cd){
    // allowed ext
    const filetype = /jpeg|jpg|png|gif/
    // check ext
    const extname = filetype.test(path.extname(file.originalname).toLowerCase())
    // check maine
    const mimetype = filetype.test(file.mimetype)

    if(mimetype && extname){
        return cd(null, true)
    }else{
        cd('Errpr: Images Only')
    }
}

// Init Upload
const upload = multer({
    storage: storage,
    limits: {fieldSize: 4000000},
    fileFilter: function(req, file, cb){
        checkFileType(file, cb)
    }
})



module.exports = upload