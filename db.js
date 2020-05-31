var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost/shoppingList";

MongoClient.connect(url,function(err,db) {
    if (err) throw err;
    var dbo = db.db("shoppingList");
    var myIngredients = [{"name": "onion","isMeasuredByCount": true},
                        {"name": "potato","isMeasuredByCount": true},
                        {"name": "milk","isMeasuredByCount": false},
                        {"name": "butter","isMeasuredByCount": false}];
    // dbo.createCollection("ingredients", function(err,db) {
    //     if (err) throw err;
    //     console.log("got through.");
    // })
    dbo.collection("ingredients").createIndex({name: 1},{unique: true});
    dbo.collection("ingredients").insertMany(myIngredients, function(err,res) {
        if (err) throw err;
        console.log("Number of docs inserted: " +res.insertedCount);
        db.close();
    })
})