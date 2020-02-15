let express = require('express');
let fs = require('fs');
let path = require('path');
let notes = require("./db/db.json");

let app = express();
let PORT = process.env.PORT || 3000;

let count = 0;

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public/assets")));
app.use(express.json());
/**
 * gets root
 */
app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

/**
 * gets /notes
 */
app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});

/**
 * gets /api/notes
 * Shows notes in JSON format
 */
app.get("/api/notes", function(req, res) {
    return res.json(notes);
});

/**
 * posts a new note
 * updates db.json accordingly
 */
app.post("/api/notes", function(req, res) {
    if (notes === false) 
        notes = [];
    let newNote = req.body;
    count++;
    let id = count;
    newNote.id = id;
    notes.push(newNote);
    toStringAndWrite(notes);
    res.json(notes);
});

/**
 * runs the server on PORT
 */
app.listen(PORT, function() {
    console.log("Listening on " + PORT);
});

/**
 * deletes a note and updates db.json
 */
app.delete("/api/notes/:id", function(req, res) {
    let id = req.params.id;
    for(let i = 0; i < notes.length; i++){
        if(notes[i].id == id){
            notes.splice(i, 1);
            res.json("deleted");
        }
    }
    if(notes[0] == null)
        fs.writeFileSync("db/db.json", "[]", "utf-8");
    else
        fs.writeFileSync("db/db.json", notes, "utf-8");
});

/**
 * handles all other requests to default to homepage
 */
app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

/**
 * used to convert to string and write to json file
 * @param {*} array of notes to be written to file
 */
function toStringAndWrite(array){
    let dbString = JSON.stringify(array);
    fs.writeFileSync("db/db.json", dbString, "utf-8");
}