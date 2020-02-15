let express = require('express');
let fs = require('fs');
let path = require('path');

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
    return res.json(getData());
});

app.post("/api/notes", function(req, res) {
    let dbJSON = getData();
    if (dbJSON === false) 
        dbJSON = [];
    let newNote = req.body;
    count++;
    let id = count;
    newNote.id = id;
    dbJSON.push(newNote);
    toStringAndWrite(dbJSON);
    res.json(dbJSON);
});

app.listen(PORT, function() {
    console.log("Listening on " + PORT);
});

app.delete("/api/notes/:id", function(req, res) {
    let id = parseInt(req.params.id);
    let dbJSON = getData();

    for(let i = 0; i < dbJSON.length; i++) {
        if(dbJSON[i].id === id){
            let newArr = dbJSON.filter(note => {
                return note.id !== id;
            });
        }
    }

    toStringAndWrite(newArr);
    res.json(newArr);
});

app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

function getData() {
    let dbString = fs.readFileSync("db/db.json", 'utf8');
    if (dbString !== ""){
        let dbJSON = JSON.parse(dbString);
        return dbJSON;
    }
    return false;
}

function toStringAndWrite(array){
    let  dbString = JSON.stringify(array);
    fs.writeFileSync("db/db.json", dbString, "utf-8");
}