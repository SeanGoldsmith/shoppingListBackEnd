var masterList = {};

function addByCount(originalIng,addedIng) {
    if (originalIng.measure=="count" && addedIng.measure=="count") {
        return originalIng.amount + addedIng.amount;
    }
    else {
        throw `Problem with ${originalIng.name}. Check your measurements`;
    }
}

function convertToTbsp(ing) {
    var totalInTbsp = 0;
    switch (ing.measure) {
        case "cups":
            totalInTbsp+=(ing.amount*16);
            break;
        case "tbsp":
            totalInTbsp+=(ing.amount);
            break;
        case "tsp":
            totalInTbsp+=(ing.amount/3);
            break;
        case "count":
           throw `Problem with ${ing.name}. Check your measurements.`;
    }
    return totalInTbsp;
}

function addIngredients(originalIng,addedIng) {
    if(!(originalIng.measure=="count")){
        try {
            var totalInTbsp = convertToTbsp(originalIng);
            totalInTbsp += convertToTbsp(addedIng);
            console.log(`${totalInTbsp} tbsp of ${originalIng.name}`);
        }
        catch(err) {
            return (err);
        }
    } else {
        try {
            console.log(addByCount(originalIng,addedIng) + " " + originalIng.name);
        }
        catch (err) {
            return (err);
        }
    }
}

function addToMaster(masterList,recipe) {
    try {
        recipe.forEach(elem => {
            if((!masterList[elem.name]) && !(elem.measure=="count")) {
                masterList[elem.name] = {"amount":convertToTbsp(elem),"measure":"tbsp"};
            }
            else if ((!masterList[elem.name]) && (elem.measure=="count")) {
                masterList[elem.name] = {"amount":elem.amount,"measure":elem.measure};
            }
            else if((masterList[elem.name]) && (masterList[elem.name].measure=="count")){
                masterList[elem.name].amount+=elem.amount;
            }
            else {
                masterList[elem.name].amount += convertToTbsp(elem);
            }
        })
        console.log(JSON.stringify(masterList,null,2));
    }
    catch (err) {
        console.log(err);
    }
    
}
var ings = [
    {"name":"onions",
    "amount":1,
    "measure":"count"},
    {"name":"tomatoes",
    "amount":1,
    "measure":"count"},
    {"name":"flour",
    "amount":3,
    "measure":"tbsp"}
]

var ings2 = [
    {"name":"onions",
    "amount":6,
    "measure":"count"},
    {"name":"tomatoes",
    "amount":8,
    "measure":"count"},
    {"name":"flour",
    "amount":2,
    "measure":"cups"},
    {"name":"beer",
    "amount":2,
    "measure":"cups"}
]
var ings3 = [
    {"name":"beer",
    "amount":16,
    "measure":"tbsp"}
]
console.log(addToMaster(masterList,ings));
console.log(addToMaster(masterList,ings2));
console.log(addToMaster(masterList,ings3));