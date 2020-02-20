// Dependencies
// =============================================================
const express = require("express");
const path = require("path");
const fs = require("fs");
let notes = path.join(__dirname, "/db/db.json");

// Empty array to hold new notes
notes = [];

// Sets up the Express App
// =============================================================
const app = express();
const PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.get("/api/notes", function (req, res) {
    let data = fs.readFileSync("db/db.json", "utf-8");
    let note = JSON.parse(data);
    console.log(note);
    res.json(notes);
});

app.post("/api/notes", function (req, res) {

    const newNote = req.body;

    if (notes.length <= 0) {
        const noteID = 1;
        newNote.id = noteID;
    }
    else {
        const i = notes.length - 1;
        const noteID = notes[i].id + 1;
        newNote.id = noteID;
    }

    notes.push(newNote);

    fs.writeFile("./db/db.json", JSON.stringify(notes), err => {
        if (err) throw err;
        res.json(newNote);
    });
});

app.delete("/api/notes/:id", function (req, res) {
    const deleteID = parseInt(req.params.id);
    for (let i = 0; i < notes.length; i++) {
        if (deleteID === notes[i].id) {
            console.log("Deleted selected note from json.db");
            notes.splice(i, 1);
        }
    }

    fs.writeFile("./db/db.json", JSON.stringify(notes), err => {
        if (err) throw err;
        res.json(notes);
    });
});

app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});