// Create express app
var express = require("express");
var app = express();
var db = require("./database.js");

const got = require("got");
const asyncMiddleware = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

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
                story: response.body.replace(/(\r\n|\n|\r)/gm, ""),
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
                    message: "Success. Latest Story has been retrieved from repository.",
                });
            });
        } catch (error) {
            console.log(error.response.body);
            //=> 'Internal server error ...'
        }
    })();
});

app.route("/repository/getstorydetail").get(function(req, res) {
    (async() => {
        try {
            //call id from db
            var destroying = "DELETE FROM hn_story_detail";
            db.run(destroying);
            db.serialize(function() {
                var rowset = db.each("select story from hn_story", function(err, row) {
                    mydata = row.story;
                    mydata = JSON.parse(mydata);
                    //console.log(mydata);

                    mydata.forEach(
                        asyncMiddleware(async(element) =>
                            //console.log(element)
                            {
                                const response = await got(
                                    "https://hacker-news.firebaseio.com/v0/item/" +
                                    element +
                                    ".json?print=pretty"
                                );
                                var jsonData = JSON.parse(response.body);
                                var data = {
                                    storyid: jsonData.id,
                                    type: jsonData.type,
                                    by: jsonData.by,
                                    time: jsonData.time,
                                    parent: jsonData.parent,
                                    kids: jsonData.kids,
                                    url: jsonData.url,
                                    score: jsonData.score,
                                    title: jsonData.title,
                                    descendants: jsonData.descendants,
                                    favorite: "false",
                                };
                                //console.log(data);

                                var sql =
                                    "INSERT INTO hn_story_detail (storyid,type,by,time,parent,kids,url,score,title,descendants,favorite) VALUES (?,?,?,?,?,?,?,?,?,?,?)";
                                var params = [
                                    data.storyid,
                                    data.type,
                                    data.by,
                                    data.time,
                                    data.parent,
                                    data.kids,
                                    data.url,
                                    data.score,
                                    data.title,
                                    data.descendants,
                                    data.favorite,
                                ];

                                db.run(sql, params, function(err, result) {
                                    console.log(data);
                                });
                                //console.log(params);
                            }
                        )
                    );
                    res.json({
                        message: "Success. Story Detail has been retrieved from repository.",
                    });
                });
            });
        } catch (error) {
            console.log(error.response.body);
            //=> 'Internal server error ...'
        }
    })();
});

app.get("/api/story", (req, res, next) => {
    var sql = "select story from hn_story";
    var params = [];
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.get("/api/story/:storyid", (req, res, next) => {
    var sql = "select * from hn_story_detail where storyid = ?";
    var params = [req.params.storyid];

    db.get(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            data: row,
        });
    });
});

app.get("/api/story/:storyid/addfav", (req, res, next) => {
    var params = [req.params.storyid];

    var data = {
        params,
    };

    db.run(
        `UPDATE hn_story_detail set 
           favorite = "true"
           WHERE storyid = ?`,
        params,
        function(err, result) {
            if (err) {
                res.status(400).json({ error: res.message });
                return;
            }
            res.json({
                message: "Story with id : " + params + " has been favorited.",
            });
        }
    );
});

app.get("/api/showfav", (req, res, next) => {
    var sql = "SELECT storyid FROM hn_story_detail WHERE favorite = 'true'";
    db.get(sql, (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: "Story with favorite embedded : ",
            data: row,
        });
    });
});

// Default response for any other request
app.use(function(req, res) {
    res.status(404);
});