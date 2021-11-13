// Create express app
var express = require("express");
var app = express();
var db = require("./database.js");
var md5 = require("md5");

const got = require("got");
const { pipeline } = require("stream");

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Server port
var HTTP_PORT = 8000;
// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%", HTTP_PORT));
});
// Root endpoint
app.get("/", (req, res, next) => {
    res.json({ message: "Ok" });
});

// Insert here other API endpoints

app.route("/repository/getstory").get(function(req, res) {
    (async() => {
        try {
            const response = await got(
                "https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty"
            );
            console.log(response.body);
            var data = {
                story: (response.body).replace(/(\r\n|\n|\r)/gm, "")
            };
            var destroying = "DELETE FROM hn_story";
            var sql = "INSERT INTO hn_story (story) VALUES (?)";
            var params = [data.story];
            db.run(destroying);
            db.run(sql, params, function(err, result) {
                if (err) {
                    res.status(400).json({ error: err.message });
                    return;
                }
                res.json({
                    message: "success",
                    data: data,
                    id: this.lastID,
                });
            });
            //=> '<!doctype html> ...'
        } catch (error) {
            console.log(error.response.body);
            //=> 'Internal server error ...'
        }
    })();
});

app.get("/api/story/", (req, res, next) => {
    var sql = "select * from hn_story";
    var params = [];
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: "success",
            data: rows,
        });
    });
});

// Default response for any other request
app.use(function(req, res) {
    res.status(404);
});