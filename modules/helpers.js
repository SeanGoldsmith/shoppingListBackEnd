module.exports = {
    validateIngredients: function (ing) {
        if(ing.name && ing.hasOwnProperty('isMeasuredByCount') && (ing.isMeasuredByCount=="true"||ing.isMeasuredByCount=="false")) {
            return true;
        }
        else if(ing.name && ing.measure && ing.amount) {
            return true;
        }
        else {
            return false;
        }
    },
    validateRecipes: function (recipe) {
        if (recipe.name && recipe.tags && recipe.ingredients) {
            for(i=0;i<recipe.ingredients.length;i++) {
                if(!this.validateIngredients(recipe.ingredients[i])) {
                    console.log(recipe.ingredients[i] + " failed");
                    return false;
                }
                return true;
            }
        }
        return false;
    },
    boolCheck: function(value) {
        if (value=="true" || value=="false") {
            return true;
        }
        else return false;
    }
}

