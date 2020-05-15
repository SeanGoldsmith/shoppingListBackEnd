const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const port = process.env.PORT || 3200;

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost/shoppingList";

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false}));
app.use(function (request,response,next) {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "*");
    response.header("Access-Control-Allow-Methods","POST,GET,OPTION,DELETE,PUT");
    next();
})

app.get("/getIngredients/", (req,res) => {
    MongoClient.connect(url, function(err,db) {
        if (err) {
            console.log("Whoops");
            res.status(500).json({message: "We broke it. Big time."});
            return;
        }
        var dbo = db.db("shoppingList");
        dbo.collection("ingredients").find({}).toArray(function(err,response) {
            if (err) {
                console.log("Error in Ingredients call.");
                res.status(500).json({message: "Something went wrong."});
            }
            db.close();
            res.status(200).send(response);
        });        
    })
})

app.listen(port, () => {
    console.log(`running at port ${port}`);
})