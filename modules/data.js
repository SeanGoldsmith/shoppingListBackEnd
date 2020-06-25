module.exports = {
    runAdditions: function(recipes) {
        var masterList = {};
        recipes.forEach(elem => {
            try {
                this.addToMaster(masterList,elem.ingredients);
            }
            catch(err) {
                console.log(`Problem with ${elem.name}: ${err}`);
                throw(`Problem with ${elem.name}: ${err}`);
            }
        });
        return this.gatherOutput(masterList);
    },
    addToMaster: function(masterList,recipe) {
        try {
            recipe.forEach(elem => {
                //if The ingredient has not been added to master and is measured by volume
                if((!masterList[elem.name]) && !(elem.measure=="count")) {
                    masterList[elem.name] = {"amount":this.convertToTbsp(parseFloat(elem)),"measure":"tbsp"};
                }
                // if item has not been added to master and is measured by count
                else if ((!masterList[elem.name]) && (elem.measure=="count")) {
                    masterList[elem.name] = {"amount":parseFloat(elem.amount),"measure":elem.measure};
                }
                //if the item exists on master and is measured by count.
                else if((masterList[elem.name]) && (masterList[elem.name].measure=="count")){
                    if(elem.measure!=="count"){
                        throw `Problem with ${elem.name}. Check your measurments`;
                    }
                    masterList[elem.name].amount+=parseFloat(elem.amount);
                }
                //if item exists on master and is measured by volume
                else {
                    masterList[elem.name].amount += this.convertToTbsp(parseFloat(elem));
                }
            })
            // console.log(JSON.stringify(masterList,null,2));
        }
        catch (err) {
            throw (err);
        } 
    },
    convertToTbsp: function(ing) {
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
    },
    gatherOutput: function(finalList) {
        const listKeys = Object.keys(finalList);
        listKeys.forEach(elemKey => {
            var newData = this.finalResult(finalList[elemKey]);
            finalList[elemKey].amount = newData.amount;
            finalList[elemKey].measure = newData.measure;
        })
        return finalList;
    },
    finalResult: function(ing) {
        if(!(ing.measure=="count")){
            var cups = ing.amount/16;
            if (cups >= 1) {
                return {"amount":Math.ceil(cups),"measure":"cups"};
            }
            else return {"amount":Math.ceil(ing.amount),"measure":"tbsp"};
        }
        else return ing;  
    }


}

// console.log(runAdditions(allRecipes));
// addToMaster(masterList,recipe.ingredients);
// addToMaster(masterList,recipe2.ingredients);
// addToMaster(masterList,recipe3.ingredients);

