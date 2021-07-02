import multer from "multer";


const storage = multer.diskStorage({
    filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
    },
    destination:'./uploads',
    });

const imageFilter = function(req, file, cb) {
    // accept image files only
    
    cb(null, true);
    };

export const upload = multer({ storage: storage, fileFilter: imageFilter });