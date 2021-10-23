const express = require('express')
const multer = require('multer')
const ejs = require('ejs')
const path = require('path')
const fs = require('fs')




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
}).single('docs')
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

app.get('/', (req, res) => res.render('index'))

app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        if(err) {
            res.send({
                msg: err.message
            })
        }
        else {
            if(req.file == undefined) {
                res.send({
                    msg: 'Error: No File Selected'
                })
            }
            else {
                res.send({
                    msg: 'File Uploaded!',
                    file: `uploads/${req.file.filename}`
                })
            }
        }
    })
})


app.get('/files', (req, res) => {
    
    const id = req.query.id
    const pass = req.query.password
    
    if (id === 'zeshan' && pass === '1234') {
        let direcotry = './public/uploads'
        let dirBuf = Buffer.from(direcotry)
        fs.readdir(dirBuf, (err, files) => {
            if(err) {
                res.send(err)
            }
            else {
                res.send(files)
            }
        })
    }
    else [
        res.send({
            msg: 'invalid user'
        })
    ]
    
})

app.get('/file', (req, res) => {
    
    const id = req.query.id
    const pass = req.query.password

    if (id === 'zeshan' && pass === '1234') {
        const fileName = req.query.fileName
        let direcotry = './public/uploads'
        let dirBuf = Buffer.from(direcotry)
        let filePath = direcotry+'/'+fileName
        if(fs.existsSync(filePath)) {
            fs.readFile(filePath, (err, data) => {
                res.set({
                  "Content-Type": "application/pdf", //here you set the content type to pdf
                  "Content-Disposition": "inline; filename=" + fileName, //if you change from inline to attachment if forces the file to download but inline displays the file on the browser
                });
                res.send(data); // here we send the pdf file to the browser
                });
        }
        else {
            console.log('file not found')
        }   
    }
    else {
        res.send({
            msg: 'invalid user'
        })
    }    
})


app.listen(port, () => console.log(`server started ib port ${port}`))
