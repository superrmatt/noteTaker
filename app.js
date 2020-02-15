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

app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.get("/api/notes", function(req, res) {
    return res.json(notes);
});

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

app.listen(PORT, function() {
    console.log("Listening on " + PORT);
});

app.delete("/api/notes/:id", function(req, res) {
    let id = req.params.id;
    for(let i = 0; i<notes.length; i ++){
        if(notes[i].id == id){
           let test = notes.splice(i, 1);
            console.log(test);
            console.log(notes[i]);
            res.json("note " + notes[i].title + " deleted");
        }
    }
});

app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

function toStringAndWrite(array){
    let dbString = JSON.stringify(array);
    fs.writeFileSync("db/db.json", dbString, "utf-8");
}