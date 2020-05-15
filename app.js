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

app.get("/getIngredient/:name/",(req,res)=> {
    var ingredientName = req.params.name;
    MongoClient.connect(url, function(err,db) {
        if (err) {
            console.log("Couldn't connect to database.");
            res.status(500).json({message:"Could not connect to database."})
            return;
        }
        var dbo = db.db("shoppingList");
        dbo.collection("ingredients").findOne({name:ingredientName},function sendResponse(err,result) {
            if (err) {
                console.log("Something broke.");
                res.status(500).json({message: "Something Broke."});
                db.close();
                return;
            }
            if (result!==null){
                res.status(200).json(result);
            }
            else {
                res.status(404).json({message: "We couldn't find that ingredient."});
            }
            db.close();
        });
    })
})

app.post("/new-ingredient/:name/:measurements", (req,response) => {
    let ingredient = {name: req.params.name, measure: req.params.measurements};

    MongoClient.connect(url,function getIngredientData (err,db) {
        if (err) {
            console.log("Whoops.");
            response.status(500).json({message:"Something went wrong"});
            return;
        }
        var dbo = db.db("shoppingList");
        dbo.collection("ingredients").insertOne(ingredient).then(function sendResponse (data) {
            response.status(200).json({message: `Ingredient ${ingredient.name} added to db!`});
            db.close();
        }).catch(function handleError (err) {
            console.log(`Error code: ${err.code} ==> Unique constraint failed.`);
            if (err.code==11000){
                response.status(500).json({message:"This ingridient alreay exists in database!"});
                db.close();
            }
            else {
                response.status(500).json({message:"Something went wrong"});
                db.close();
            }    
        })
    })   
})

app.listen(port, () => {
    console.log(`running at port ${port}`);
})