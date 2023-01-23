//dependendies
const express = require("express"); 
const path = require("path"); 
const fs = require("fs"); 
const dbData = "./Develop/db/db.json"

//pathfile system
const util = require("util"); 


//handling async proccesses promisify the readFile and writeFile systems 
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

//set up server to communicate with heroku as well 
const app = express() ;
const PORT = process.env.PORT || 8000; 

//make sure json will be coded as intended 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//static middleware for css & other public files 
app.use(express.static((path.join(__dirname, "Develop/public")))); 


//GET routes API routes reading db.json file & converting into array & into readable format
app.get("/api/notes", function(req, res){
    readFileAsync(dbData, "utf8").then(function(data){
        notes = [].concat(JSON.parse(data))
        res.json(notes);
    })
}); 

//POST request, reading & pushing into array 
app.post('/api/notes', function (req, res) {
  const dbPost = JSON.parse(fs.readFileSync(dbData).toString());
      const noteData = req.body;
      noteData.id = Date.now();
      dbPost.push(noteData);
  
      fs.writeFile(dbData, JSON.stringify(dbPost), function (err) {
          if (err) {
              throw err;
          };
      });
  
      res.json(noteData);
  });
  
  //DELETE request to target which note to delete 
app.delete("/api/notes/:id", function(req, res) {
    const idToDelete = parseInt(req.params.id);
    //read JSON file & turn into array 
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
    res.sendFile(path.join(__dirname, "Develop/public/notes.html"));
    });
  
    //only need this to catch all & no need to specify 

    app.get("*", function(req, res) {
      res.sendFile(path.join(__dirname, "Develop/public/index.html"));
   });
  
  
  // Listening
  app.listen(PORT, function() {
      console.log("App listening on PORT " + PORT);
    });

