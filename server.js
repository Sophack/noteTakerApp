//dependendies, the only non built in is the express.js
const express = require("express"); 
const path = require("path"); 
const fs = require("fs"); 

//pathfile system
const util = require("util"); 


//handling async proccesses promisify the readFile and writeFile systems 
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

//set up server to communicate with heroku as well 
const app = expres() ;
const PORT = process.env.PORT || 8000; 

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//static middleware for css & other public files 
app.use(express.static("../develop/public")); 


//GET routes API routes reading db.json file & converting into array & into readable format
app.get("/api/notes", function(req, res){
    readFileAsync("./develop/db/db.json", "utf8").then(function(data){
        notes = [].concat(JSON.parse(data))
        res.json(notes);
    })
}); 

//POST request, reading & pushing into array 
app.post("/api/notes", function(req, res){
    const note = req.body;
    readFileAsync(".develop/db/db.json", "utf8").then(function(data){
        notes = [].concat(JSON.parse(data))
        const notes = [].concat(JSON.parse(data));
        note.id = notes.length + 1
        //add to array notes & generating new notes 
        notes.push(note);
        return notes
      }).then(function(notes) {
        writeFileAsync("./develop/db/db.json", JSON.stringify(notes))
        res.json(note);
      })
  });

//DELETE request to target which note to delete 
app.delete("/api/notes/:id", function(req, res) {
    const idToDelete = parseInt(req.params.id);
    readFileAsync("./develop/db/db.json", "utf8").then(function(data) {
      const notes = [].concat(JSON.parse(data));
      const newNotesData = []
      for (let i = 0; i<notes.length; i++) {
        if(idToDelete !== notes[i].id) {
          newNotesData.push(notes[i])
        }
      }

      //read json file & turn into array 

     //instead of deleting specified note, it will push all other notes & create a new list 
      return newNotesData
    }).then(function(notes) {
      writeFileAsync("./develop/db/db.json", JSON.stringify(notes))
      res.send('successfully saved!');
    })
  })
  

  // HTML Routes
app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "./develop/public/notes.html"));
    });
  
  app.get("/", function(req, res) {
       res.sendFile(path.join(__dirname, "./develop/public/index.html"));
    });
  
    app.get("*", function(req, res) {
      res.sendFile(path.join(__dirname, "./develop/public/index.html"));
   });
  
  
  // Listening
  app.listen(PORT, function() {
      console.log("App listening on PORT " + PORT);
    });

