// Import required modules
const express = require('express') // Web framework for Node.js
const app = express() // Create an Express application
const path = require('path') // Node.js path module for handling file paths
const fs = require('fs') // File System module for interacting with files

// Set up Express configuration
app.set('view engine', 'ejs') // Set EJS as the template engine
app.use(express.json()) // Middleware to parse JSON request bodies
app.use(express.urlencoded({extended: true})) // Middleware to parse URL-encoded request bodies
app.use(express.static(path.join(__dirname, 'public'))) // Serve static files from the 'public' directory

// Route handler for the home page
app.get('/', (req, res) => {
   // Read the contents of the 'files' directory
   fs.readdir(`./files`, function(err, files){
      // Render the index page and pass the list of files
      res.render("index", {files: files})
   })
})


app.get('/edit/:filename', (req, res)=>{
   res.render("edit", {filename: req.params.filename});
})



app.post('/edit', (req, res) => {
   // Write a new file with the title (converted to a filename) and details
   // Remove spaces from the title to create a valid filename
   fs.rename(`./files/${req.body.previous}`,`./files/${req.body.new}`, (err)=>{
      res.redirect('/')
   })
})

// Route handler to view a specific file
app.get('/file/:filename', (req, res) => {
   // Read the contents of the specified file
   fs.readFile(`./files/${req.params.filename}`, "utf-8", (err, fileData) => {
      // Handle any errors during file reading
      if (err) {
          console.error(err);
          return res.status(500).send("Error reading file");
      }
      // Render the show page with the file name and contents
      res.render('show', { filename: req.params.filename, fileData: fileData });
  });
})

// Route handler to create a new file
app.post('/create', (req, res) => {
   // Write a new file with the title (converted to a filename) and details
   // Remove spaces from the title to create a valid filename
   fs.writeFile(`./files/${req.body.title.split(' ').join('')}.txt`, req.body.details, (err) => {
      // Redirect to the home page after file creation
      res.redirect('/')
   })
})

// Start the server and listen on port 3000
app.listen(3000)