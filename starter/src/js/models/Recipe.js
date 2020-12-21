import axios from 'axios';

export default class Recipe{
    constructor(id){
        this.id=id;
    }
    async getRecipe(){
        try{
            const result=await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
            // console.log(result);
            this.imgUrl=result.data.recipe.image_url;
            this.ingredients=result.data.recipe.ingredients;
            this.publisher=result.data.recipe.publisher;
            this.publisherUrl=result.data.recipe.ingredients;
            this.recipeId=result.data.recipe.recipe_id;
            this.sourceUrl=result.data.recipe.source_url;
            this.title=result.data.recipe.title;
        }catch(error){
            console.log(error);
            alert('something went wrong');
        }
    }
    calcTime(){
        //assuming 3 ingredients take 15 mins
        const numIngredients=this.ingredients.length
        const periods=Math.ceil(numIngredients/3);
        this.time= periods*15;
    }
    calcServings(){
        this.servings=4;
    }

    parseIngredients(){
        const longTerms=['tablespoons','tablespoon','cups','ounces','teaspoons','teaspoon','pounds'];
        const shortTerms=['tbsp','tbsp','cup','ounce','tsp','tsp','pound'];
        const units=[...shortTerms,'kg','g'];
        

        let newIngredients=this.ingredients.map(el=> {
            let ingredient=el.toLowerCase();
            //1.standardize all units to one type
            longTerms.forEach((el,i)=>{
            ingredient=ingredient.replace(el,shortTerms[i]);
            })  
            //2.remove parenthesses
            ingredient=ingredient.replace(/ *\([^)]*\) */g, " ");

            //3. parse ingredients into count unit and ingredient
            const arrIng=ingredient.split(' ');
            const unitIndex=arrIng.findIndex(el1=> units.includes(el1));

            let objIng;
            if(unitIndex!==-1){
                //number and unit are present
                //ex: 1 1/2 cup of water
                //ex: 2 cups of oil
                const arrCount=arrIng.slice(0,unitIndex);
                let count;
                if(arrCount.length===1){
                    count = eval(arrCount[0].replace('-','+'));
                }else{
                    count = eval(arrIng.slice(0,unitIndex).join('+'));
                }
                // //keeps count fixed to one decimal point ex:0.3333333 => 0.3
                // //parseFloat here specifically remove unsignificant 0's ex: 2.0 => 2 
                // count=parseFloat(count.toFixed(1));

                objIng={
                    count,
                    unit: arrIng[unitIndex],
                    ingredient:arrIng.slice(unitIndex+1).join(' ')
                }
            }else if(parseInt(arrIng[0],10)){
                //number present but no unit
                //ex : 1 maggi packet
                objIng={
                    count:parseInt(arrIng[0],10),
                    unit:'',
                    ingredient:arrIng.slice(1).join(' ')
                }
            }
            else if(unitIndex===-1){
                //no unit and no number
                //tomato ketchup
                objIng={
                    count:1,
                    unit:'',
                    ingredient
                }
            }
            return objIng;
        })

        this.ingredients=newIngredients;
    }
    updateServings(type){
        //servings
        const newServings = type==='dec' ? this.servings-1 : this.servings+1;
        //ingredients
        this.ingredients.forEach(ing=>{
            ing.count=ing.count * (newServings/this.servings);
        });

        this.servings=newServings;
    }
}