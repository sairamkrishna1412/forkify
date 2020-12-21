// Global app controller
import Search from './models/Search' ;
import Recipe from './models/Recipe';
import List from './models/List';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView'
import * as listView from './views/listView'
import * as likesView from './views/likesView'
import {elements,renderLoader,clearLoader} from './views/base' ;
import Likes from './models/Likes';


const state={};
window.state=state;

/**
 * SEARCH CONTROLLER
 */

const controlSearch=async ()=>{
    //1.get query from ui
    const query=searchView.getInput();  
    //TESTING
    // const query='pizza';
    if(query){
        //2.new search object and add to state
        state.search=new Search(query);
        //3.display ui for search wait
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchResults);
        try{

            //4.get search result from api
            await state.search.getResults();
            //5.display results to ui
            clearLoader();
            searchView.renderResults(state.search.results);
        }catch(error){
            console.log('something went wrong with the search!');
            clearLoader();
        }

    }
};

elements.searchSubmit.addEventListener('submit',e => {
    e.preventDefault();
    controlSearch();
});

elements.searchResultsPages.addEventListener('click',e=>{
    const btn=e.target.closest('.btn-inline');
    if(btn){
        searchView.clearResults();
        const goTo=parseInt(btn.dataset.goto,10);
        searchView.renderResults(state.search.results,goTo);
    }
})

/**
 * RECIPE CONTROLLER
 */

 const controlRecipe=async ()=>{
     const id=window.location.hash.replace('#','');
     console.log(id);
     if(id){

         //1.prepare ui for change
        recipeView.clearRecipe();
        renderLoader(elements.recipe);
        //uncomment after removing bug
        //if(state.search) searchView.highlightSelected(id);
         //2.create new recipe object
        state.recipe=new Recipe(id);
        try{
            //3.get recipe result from api and parse ingredients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            //4.calc time and servings
            state.recipe.calcTime();
            state.recipe.calcServings();
            
            //5.render recipe
            clearLoader();
            recipeView.renderRecipe(state.recipe,state.like.isLiked(state.recipe.id));
            //if(state.like) likesView.toggleLikebtn(state.like.isLiked(state.recipe.id));

        }catch(error){
            alert('could not get recipe!');
        }
     }
 }

 ['hashchange','load'].forEach(event => window.addEventListener(event,controlRecipe));

//handling recipe button clicks

//servings buttons
const controlList = ()=>{
    //1.create new list object if there is none
    if(!state.list) state.list=new List();
    //2.add list items
    state.recipe.ingredients.forEach(ing => {
        const item=state.list.addItem(ing.count,ing.unit,ing.ingredient);
        listView.renderItem(item);
    });
}
//likes controller
const controlLike=()=>{
    //create likes object if not exists
    if(!state.like) state.like=new Likes();
    //add like if not exists
    const id=state.recipe.id;
    if(!state.like.isLiked(id)){
        //add like to the state
        const newLike = state.like.addLike(
            id,
            state.recipe.title,
            state.recipe.publisher,
            state.recipe.imgUrl
        );
        //toggle like button
        likesView.toggleLikebtn(true);     
        //add like to UI list
        likesView.addLike(newLike);
    }else{
        //remove like from state
        state.like.removeLike(id);
        //toggle like button
        likesView.toggleLikebtn(false);
        //remove like from UI list
        likesView.removeLike(id);
    }
    likesView.toggleLikeMenu(state.like.getNumLikes());
}

//read storage on page reload
window.addEventListener('load',()=>{
    //create a new like object on load
    state.like=new Likes();
    //retrive storage from localstorage
    state.like.retriveStorage();
    //toggle likes menu icon 
    likesView.toggleLikeMenu(state.like.getNumLikes());
    //render like on to the UI
    state.like.Likes.forEach(like => likesView.addLike(like));
});

elements.recipe.addEventListener('click',e=>{
    if(e.target.matches('.btn-decrease, .btn-decrease *')){
        //decrease servings
        if(state.recipe.servings>1){
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    }
    else if(e.target.matches('.btn-increase, .btn-increase *')){
        //increase servings
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    }
    else if(e.target.matches('.recipe__btn-add, .recipe__btn-add *')){
        //add to shopping list
        controlList();
    }
    else if(e.target.matches('.recipe__love, .recipe__love *')){
        //like button
        controlLike();
    }
    //console.log(state.recipe);
});

elements.shopping.addEventListener('click',e=>{
    const id=e.target.closest(".shopping__item").dataset.itemid;

    //delete item from shopping list
    if(e.target.matches('.shopping__delete, .shopping__delete *')){
        state.list.deleteItem(id);
        listView.deleteItem(id);
    }
    //update item in shopping list
    else if(e.target.matches('.shopping__count--value')){
        const value=parseFloat(e.target.value,10);
        state.list.updateCount(id,value);
    }
});

