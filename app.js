const express = require('express')
const multer = require('multer')
const ejs = require('ejs')
const path = require('path')
const serveIndex = require('serve-index')

// Set Storage Engine
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
})
// Init Upload 
const upload = multer({
    storage: storage,
    limits: {fileSize: 5000000},
    fileFilter: function(req, file, cb) {
        checkFileType(file,cb)
    }
}).single('Docs')
//Check File Type
function checkFileType(file, cb) {
    //Allowed ext
    const filetypes = /pdf|doc|docx/
    //Check ext 
    const extname = filetypes.test(path.extname(file.originalname).toLocaleLowerCase())
    //Check mime
    const mimetype = filetypes.test(file.mimetype)
    if(mimetype && extname) {
        return cb(null, true)
    }
    cb('Error: Pdf/Doc File only!')
}

//Init app
const app = express()
const port = process.env.PORT || 3000

//EJS
app.set('view engine', 'ejs');

//Public Folder 
app.use(
    '/ftp',
    express.static('public/ftp'),
    serveIndex('public/ftp', { icons: true })
)
app.get('/', (req, res) => res.render('index'))

app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        if(err) {
            res.render('index', {
                msg: err
            })
        }
        else {
            if(req.file == undefined) {
                res.render('index', {
                    msg: 'Error: No File Selected'
                })
            }
            else {
                res.render('index', {
                    msg: 'File Uploaded!',
                    file: `uploads/${req.file.filename}`
                })
            }
        }
    })
})


app.listen(port, () => console.log(`server started ib port ${port}`))