const express = require('express')
const app = express()
const path =  require('path')
const fs = require('fs')


app.set('view engine', 'ejs');
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, 'public')));


// console.log(__dirname, 'files')
app.get('/', (req, res)=>{
   fs.readdir(`./files`, function(err, files){
      // console.log(files)
    res.render("index", {files: files})
   })
})

app.get('/file/:filename', (req, res)=>{
   fs.readFile(`./files/${req.params.filename}`, "utf-8", (err, fileData) => {
      if (err) {
          console.error(err);
          return res.status(500).send("Error reading file");
      }
      res.render('show', { filename: req.params.filename, fileData: fileData });
  });
  
})

app.post('/create', (req, res)=>{
   fs.writeFile(`./files/${req.body.title.split(' ').join('')}.txt`, req.body.details, (err)=>{
      res.redirect('/')
   })
})

app.listen(3000)