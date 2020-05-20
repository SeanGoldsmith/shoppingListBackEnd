module.exports = {
    validateIngredients: function (ing) {
        if(ing.name && ing.measure && (ing.measure=="solid"||ing.measure=="liquid")) {
            return true;
        }
        else {
            return false;
        }
    },
    validateRecipes: function (recipe) {
        if (recipe.name && recipe.link && recipe.ingredients) {
            for(i=0;i<recipe.ingredients.length;i++) {
                if(!this.validateIngredients(recipe.ingredients[i])) {
                    console.log(recipe.ingredients[i] + " failed");
                    return false;
                }
                return true;
            }
        }
        return false;
    }
}

