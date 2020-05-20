var helpers = require("./modules/helpers");
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
    MongoClient.connect(url,{ useUnifiedTopology: true}, function(err,db) {
        if (err) {
            console.log("Whoops");
            res.status(400).json({message: "We broke it. Big time."});
            return;
        }
        var dbo = db.db("shoppingList");
        dbo.collection("ingredients").find({}).toArray(function(err,response) {
            if (err) {
                console.log("Error in Ingredients call.");
                res.status(400).json({message: "Something went wrong."});
            }
            db.close();
            res.status(200).send(response);
        });        
    })
})

app.get("/getIngredient/:name/",(req,res)=> {
    var ingredientName = req.params.name;
    MongoClient.connect(url,{ useUnifiedTopology: true}, function(err,db) {
        if (err) {
            console.log("Couldn't connect to database.");
            res.status(500).json({message:"Could not connect to database."})
            return;
        }
        var dbo = db.db("shoppingList");
        dbo.collection("ingredients").findOne({name:ingredientName},function sendResponse(err,result) {
            if (err) {
                console.log("Something broke.");
                res.status(400).json({message: "Something Broke."});
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
    if (!helpers.validateIngredients(ingredient)){
        response.status(400).json({message:"Ingredient Validation failed"});
        return;
    }
    MongoClient.connect(url,{ useUnifiedTopology: true},function getIngredientData (err,db) {
        if (err) {
            console.log("Whoops.");
            response.status(400).json({message:"Something went wrong"});
            return;
        }
        var dbo = db.db("shoppingList");
        dbo.collection("ingredients").insertOne(ingredient).then(function sendResponse (data) {
            response.status(200).json({message: `Ingredient ${ingredient.name} added to db!`});
            db.close();
        }).catch(function handleError (err) {
            if (err.code==11000){
                response.status(400).json({message:"This ingridient alreay exists in database!",
                                           Error: `Code: ${err.code} ==> Unique constraint failed.`});
                db.close();
            }
            else {
                response.status(400).json({message:"Something went wrong"});
                db.close();
            }    
        })
    })   
})

app.post("/new-recipe/", (req,response) => {
    let recipe = req.body;
    if(!helpers.validateRecipes(recipe)) {
        response.status(400).json({"message":"Recipe Failed Validation"});
        return;
    }
    MongoClient.connect(url,{ useUnifiedTopology: true},function addRecipe (err,db) {
        if (err) {
            response.status(400).json({message: "something went wrong"});
            db.close();
            return
        }
        var dbo = db.db("shoppingList");
        dbo.collection("recipes").insertOne(recipe).then(function sendResponse(data) {
            response.status(200).json({message:`Recipe ${recipe.name} added to db!`});
            db.close();
        }).catch(function handleError(err) {
            response.status(400).json({message: "something went wrong. Check your obj format"});
            db.close();
        })
    })
})

app.listen(port, () => {
    console.log(`running at port ${port}`);
})

var newRecipe = {
    "name":"Fried Chicken",
    "Ingredients":[{"name":"chicken","measure":"solid"},{"name":"flour","measure":"solid"}],
}