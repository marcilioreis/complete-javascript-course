import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import { elements, renderLoader, clearLoader } from './views/base';

/** Global State of the app 
  - search object 
  - current recipe object
  - shopping list
  - liked recipes
*/
const state = {};

/*
* SEARCH CONTROLLER
*/

const controlSearch = async () => {
    // 1 - get query from view
    // const query = searchView.getInput();
    const query = 'pizza';
    // console.log(query);

    if (query) {
        // 2 - new search object and add state
        state.search = new Search(query);

        // 3 - prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        try {
            // 4 - search recipes
            await state.search.getResults();
    
            // 5 - render results on the UI
            clearLoader();
            searchView.renderResults(state.search.result);
        } catch (error) {
            alert('Something went wrong with teh search...');
            clearLoader();
        }
    }
};

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

// Test
window.addEventListener('load', e => {
    e.preventDefault();
    controlSearch();
});

elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
        console.log(goToPage);
    }
});

/*
* RECIPE CONTROLLER
*/
const controlRecipe = async () => {
    // 1 - get id from hash/url
    const id = window.location.hash.replace('#', '');
    console.log(id);

    if (id) {
        
        // 2 - prepare UI for changes
        //renderLoader(elements.recipeRes);

        // 3 - create new recipe object
        state.recipe = new Recipe(id);

        // Test
        window.r = state.recipe;

        try {
            // 4 - get recipe data
            await state.recipe.getRecipe();
    
            // 5 - calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();
    
            // 6 - render results on the UI
            //clearLoader();
            //recipeView.renderResults(state.recipe.result);
            console.log(state.recipe);
        } catch (error) {
            alert('Error processing recipe');
        }
    }
};
// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));