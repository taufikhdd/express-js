var sqlite3 = require("sqlite3").verbose();
var md5 = require("md5");

const DBSOURCE = "db.sqlite";

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
        // Cannot open database
        console.error(err.message);
        throw err;
    } else {
        console.log("Connected to the SQLite database.");
        db.run(
            `CREATE TABLE hn_story_detail (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                storyid INTEGER,
                type text,
                by text, 
                time text,
                parent text,
                kids text,
                url text,
                score INTEGER,
                title text,
                descendants INTEGER,
                favorite text
                )`,
            (err) => {
                if (err) {
                    //return console.error(err.message);
                }
                //console.log("Successful creation of the 'hn_story_detail' table");
            }
        );
        db.run(
            `CREATE TABLE hn_story (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            story text 
            )`,
            (err) => {
                if (err) {
                    //return console.error(err.message);
                }
                //console.log("Successful creation of the 'hn_story' table");
            }
        );

    }
});

module.exports = db;